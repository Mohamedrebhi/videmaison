from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key-change-in-production')

# Configure MongoDB
app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/videmaison')
mongo_client = MongoClient(app.config['MONGO_URI'])
db = mongo_client.get_database()

# Configure email
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() in ['true', '1', 't']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

# Initialize extensions
# Remove this line: cors = CORS(app, resources={r"/*": {"origins": "*"}})
jwt = JWTManager(app)
mail = Mail(app)
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Import routes
from app.routes import auth_routes, service_routes, admin_routes, chat_routes

# Register blueprints
app.register_blueprint(auth_routes.bp)
app.register_blueprint(service_routes.bp)
app.register_blueprint(admin_routes.bp)
app.register_blueprint(chat_routes.bp)

# Create .env file if it doesn't exist
if not os.path.exists('.env'):
    with open('.env', 'w') as f:
        f.write('SECRET_KEY=dev-key-change-in-production\n')
        f.write('JWT_SECRET_KEY=jwt-dev-key-change-in-production\n')
        f.write('MONGO_URI=mongodb://localhost:27017/videmaison\n')
        f.write('MAIL_SERVER=smtp.gmail.com\n')
        f.write('MAIL_PORT=587\n')
        f.write('MAIL_USE_TLS=True\n')
        f.write('MAIL_USERNAME=your-email@gmail.com\n')
        f.write('MAIL_PASSWORD=your-app-password\n')
        f.write('MAIL_DEFAULT_SENDER=your-email@gmail.com\n')