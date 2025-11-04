from app import app, socketio
from flask_cors import CORS
import os

# Configure CORS properly - this will override the CORS in __init__.py
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    },
    r"/socket.io/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    socketio.run(
        app, 
        debug=debug_mode, 
        host='localhost', 
        port=int(os.environ.get('PORT', 5000)),
        allow_unsafe_werkzeug=True
        # Suppression de l'argument cors_allowed_origins qui cause l'erreur
    )
   
