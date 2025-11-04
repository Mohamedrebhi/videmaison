from flask import request, jsonify, current_app
from functools import wraps
import time
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta
import re

class SecurityMiddleware:
    def __init__(self, app=None):
        self.app = app
        self.rate_limit_storage = {}
        self.blocked_ips = {}
        self.csrf_tokens = {}
        
    def init_app(self, app):
        self.app = app
        
    def rate_limit(self, max_requests=60, window=3600, block_duration=1800):
        """Advanced rate limiting with IP blocking"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                client_ip = self.get_client_ip()
                current_time = time.time()
                
                # Check if IP is blocked
                if client_ip in self.blocked_ips:
                    if current_time < self.blocked_ips[client_ip]:
                        return jsonify({
                            'error': 'IP temporarily blocked due to suspicious activity',
                            'retry_after': int(self.blocked_ips[client_ip] - current_time)
                        }), 429
                    else:
                        del self.blocked_ips[client_ip]
                
                # Initialize or clean request history
                if client_ip not in self.rate_limit_storage:
                    self.rate_limit_storage[client_ip] = []
                
                # Remove old requests outside the window
                self.rate_limit_storage[client_ip] = [
                    req_time for req_time in self.rate_limit_storage[client_ip]
                    if current_time - req_time < window
                ]
                
                # Check rate limit
                if len(self.rate_limit_storage[client_ip]) >= max_requests:
                    # Block IP for suspicious activity
                    self.blocked_ips[client_ip] = current_time + block_duration
                    current_app.logger.warning(f"IP {client_ip} blocked for rate limit violation")
                    return jsonify({
                        'error': 'Rate limit exceeded. IP temporarily blocked.',
                        'retry_after': block_duration
                    }), 429
                
                self.rate_limit_storage[client_ip].append(current_time)
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    def validate_input(self, required_fields=None, max_length=None):
        """Input validation and sanitization"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                data = request.get_json()
                
                if not data:
                    return jsonify({'error': 'No data provided'}), 400
                
                # Check required fields
                if required_fields:
                    for field in required_fields:
                        if field not in data or not data[field]:
                            return jsonify({'error': f'{field} is required'}), 400
                
                # Validate field lengths
                if max_length:
                    for field, max_len in max_length.items():
                        if field in data and len(str(data[field])) > max_len:
                            return jsonify({
                                'error': f'{field} exceeds maximum length of {max_len}'
                            }), 400
                
                # Sanitize inputs
                for key, value in data.items():
                    if isinstance(value, str):
                        # Remove potentially dangerous characters
                        data[key] = re.sub(r'[<>"\'\/]', '', value.strip())
                
                request.validated_data = data
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    def csrf_protect(self):
        """CSRF protection"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if request.method in ['POST', 'PUT', 'DELETE']:
                    token = request.headers.get('X-CSRF-Token')
                    if not token or not self.validate_csrf_token(token):
                        return jsonify({'error': 'Invalid CSRF token'}), 403
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    def generate_csrf_token(self, user_id):
        """Generate CSRF token for user"""
        token = secrets.token_urlsafe(32)
        self.csrf_tokens[user_id] = {
            'token': token,
            'expires': datetime.utcnow() + timedelta(hours=1)
        }
        return token
    
    def validate_csrf_token(self, token):
        """Validate CSRF token"""
        for user_id, token_data in self.csrf_tokens.items():
            if (token_data['token'] == token and 
                datetime.utcnow() < token_data['expires']):
                return True
        return False
    
    def get_client_ip(self):
        """Get real client IP address"""
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        elif request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        return request.remote_addr
    
    def log_security_event(self, event_type, details):
        """Log security events"""
        current_app.logger.warning(f"Security Event: {event_type} - {details}")

# Initialize security middleware
security = SecurityMiddleware()