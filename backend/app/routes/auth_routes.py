from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from datetime import timedelta
import logging
from functools import wraps
import time

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Rate limiting decorator
def rate_limit(max_requests=5, window=60):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Simple in-memory rate limiting (use Redis in production)
            client_ip = request.remote_addr
            current_time = time.time()
            
            if not hasattr(current_app, 'rate_limit_storage'):
                current_app.rate_limit_storage = {}
            
            if client_ip not in current_app.rate_limit_storage:
                current_app.rate_limit_storage[client_ip] = []
            
            # Clean old requests
            current_app.rate_limit_storage[client_ip] = [
                req_time for req_time in current_app.rate_limit_storage[client_ip]
                if current_time - req_time < window
            ]
            
            if len(current_app.rate_limit_storage[client_ip]) >= max_requests:
                return jsonify({'error': 'Too many requests. Please try again later.'}), 429
            
            current_app.rate_limit_storage[client_ip].append(current_time)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@bp.route('/register', methods=['POST'])
@rate_limit(max_requests=3, window=300)  # 3 registrations per 5 minutes
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new user
        user = User.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name')
        )
        
        logging.info(f"New user registered: {user['email']}")
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user['_id'],
                'email': user['email'],
                'role': user['role']
            }
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@bp.route('/login', methods=['POST'])
@rate_limit(max_requests=5, window=300)  # 5 login attempts per 5 minutes
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        
        # Check if account is locked
        if User.is_account_locked(email):
            return jsonify({'error': 'Account is temporarily locked due to multiple failed login attempts'}), 423
        
        # Check if user exists
        user = User.get_user_by_email(email)
        if not user or not User.verify_password(user['password'], data['password']):
            User.increment_failed_login(email)
            logging.warning(f"Failed login attempt for: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is active
        if not user.get('is_active', True):
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Update last login
        User.update_last_login(user['_id'])
        
        # Create tokens
        access_token = create_access_token(
            identity=str(user['_id']),
            additional_claims={'role': user['role']},
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=str(user['_id']),
            expires_delta=timedelta(days=30)
        )
        
        logging.info(f"Successful login: {user['email']}")
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'role': user['role'],
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name')
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        user = User.get_user_by_id(current_user_id)
        
        if not user or not user.get('is_active', True):
            return jsonify({'error': 'User not found or inactive'}), 404
        
        new_token = create_access_token(
            identity=current_user_id,
            additional_claims={'role': user['role']},
            expires_delta=timedelta(hours=1)
        )
        
        return jsonify({'access_token': new_token}), 200
        
    except Exception as e:
        logging.error(f"Token refresh error: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 500

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'email': user['email'],
            'role': user['role'],
            'first_name': user.get('first_name'),
            'last_name': user.get('last_name'),
            'last_login': user.get('last_login'),
            'created_at': user.get('created_at')
        }), 200
        
    except Exception as e:
        logging.error(f"Profile fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a production app, you'd want to blacklist the token
    return jsonify({'message': 'Successfully logged out'}), 200