from app import db
from passlib.hash import pbkdf2_sha256
from datetime import datetime, timedelta
import re
import secrets
import pyotp
from bson.objectid import ObjectId

class User:
    @staticmethod
    def validate_email(email):
        """Enhanced email validation"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            return False
        # Check for common disposable email domains
        disposable_domains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
        domain = email.split('@')[1].lower()
        return domain not in disposable_domains
    
    @staticmethod
    def validate_password(password):
        """Enhanced password validation"""
        if len(password) < 12:
            return False, "Password must be at least 12 characters long"
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        
        # Check against common passwords
        common_passwords = ['password123', 'admin123', '123456789']
        if password.lower() in common_passwords:
            return False, "Password is too common"
        
        return True, "Password is valid"
    
    @staticmethod
    def create_user(email, password, role='user', first_name=None, last_name=None):
        # Enhanced validation
        if not User.validate_email(email):
            raise ValueError("Invalid or disposable email address")
        
        is_valid, message = User.validate_password(password)
        if not is_valid:
            raise ValueError(message)
        
        if User.get_user_by_email(email):
            raise ValueError("User with this email already exists")
        
        # Generate 2FA secret
        totp_secret = pyotp.random_base32()
        
        user = {
            'email': email.lower().strip(),
            'password': pbkdf2_sha256.hash(password),
            'role': role,
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
            'email_verified': False,
            'two_factor_enabled': False,
            'totp_secret': totp_secret,
            'backup_codes': User.generate_backup_codes(),
            'last_login': None,
            'failed_login_attempts': 0,
            'account_locked_until': None,
            'password_changed_at': datetime.utcnow(),
            'login_sessions': [],
            'security_questions': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = db.users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        return user
    
    @staticmethod
    def generate_backup_codes(count=10):
        """Generate backup codes for 2FA"""
        return [secrets.token_hex(4).upper() for _ in range(count)]
    
    @staticmethod
    def enable_two_factor(user_id):
        """Enable 2FA for user"""
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'two_factor_enabled': True,
                'updated_at': datetime.utcnow()
            }}
        )
    
    @staticmethod
    def verify_totp(user_id, token):
        """Verify TOTP token"""
        user = User.get_user_by_id(user_id)
        if not user or not user.get('two_factor_enabled'):
            return False
        
        totp = pyotp.TOTP(user['totp_secret'])
        return totp.verify(token, valid_window=1)
    
    @staticmethod
    def use_backup_code(user_id, code):
        """Use backup code for 2FA"""
        user = User.get_user_by_id(user_id)
        if not user or code not in user.get('backup_codes', []):
            return False
        
        # Remove used backup code
        backup_codes = user['backup_codes']
        backup_codes.remove(code)
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'backup_codes': backup_codes,
                'updated_at': datetime.utcnow()
            }}
        )
        return True
    
    @staticmethod
    def add_login_session(user_id, session_data):
        """Track user login sessions"""
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {
                'login_sessions': {
                    'session_id': session_data['session_id'],
                    'ip_address': session_data['ip_address'],
                    'user_agent': session_data['user_agent'],
                    'login_time': datetime.utcnow(),
                    'last_activity': datetime.utcnow()
                }
            }}
        )
    
    @staticmethod
    def get_user_by_email(email):
        return db.users.find_one({'email': email.lower().strip()})
    
    @staticmethod
    def get_user_by_id(user_id):
        try:
            return db.users.find_one({'_id': ObjectId(user_id)})
        except:
            return None
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        return pbkdf2_sha256.verify(provided_password, stored_password)
    
    @staticmethod
    def is_account_locked(email):
        """Check if account is locked due to failed login attempts"""
        user = User.get_user_by_email(email)
        if not user:
            return False
        
        account_locked_until = user.get('account_locked_until')
        if account_locked_until and datetime.utcnow() < account_locked_until:
            return True
        
        # If lock period has expired, reset failed attempts
        if account_locked_until and datetime.utcnow() >= account_locked_until:
            db.users.update_one(
                {'email': email.lower().strip()},
                {'$set': {
                    'failed_login_attempts': 0,
                    'account_locked_until': None,
                    'updated_at': datetime.utcnow()
                }}
            )
        
        return False
    
    @staticmethod
    def increment_failed_login(email):
        """Increment failed login attempts and lock account if necessary"""
        user = User.get_user_by_email(email)
        if not user:
            return
        
        failed_attempts = user.get('failed_login_attempts', 0) + 1
        update_data = {
            'failed_login_attempts': failed_attempts,
            'updated_at': datetime.utcnow()
        }
        
        # Lock account after 5 failed attempts for 30 minutes
        if failed_attempts >= 5:
            update_data['account_locked_until'] = datetime.utcnow() + timedelta(minutes=30)
        
        db.users.update_one(
            {'email': email.lower().strip()},
            {'$set': update_data}
        )
    
    @staticmethod
    def update_last_login(user_id):
        """Update user's last login time and reset failed attempts"""
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'last_login': datetime.utcnow(),
                'failed_login_attempts': 0,
                'account_locked_until': None,
                'updated_at': datetime.utcnow()
            }}
        )