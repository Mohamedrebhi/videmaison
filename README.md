# VideMaison

A modern full-stack real estate management platform built with React and Flask, featuring real-time communication, admin dashboard, and multilingual support.

## Overview

VideMaison is a comprehensive real estate management platform designed to streamline property management, communication, and user experience. The platform is built using React and Flask, with a focus on scalability, security, and maintainability.

## Features

- **Property Listings**: Browse and manage real estate properties
- **Real-time Chat**: WebSocket-based live communication system
- **Admin Dashboard**: Comprehensive admin panel for property and user management
- **Multilingual Support**: Multi-language interface for better accessibility
- **Authentication**: Secure JWT-based authentication system
- **Email Notifications**: Automated email notifications via Flask-Mail
- **Responsive Design**: Modern, mobile-friendly UI with styled-components
- **3D Visualizations**: Interactive 3D elements using Three.js

## Tech Stack

### Frontend

- **React** 19.2.0 - UI framework
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Three.js & React Three Fiber** - 3D graphics
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend

- **Flask** 2.0.1 - Python web framework
- **Flask-SocketIO** - WebSocket support
- **MongoDB** - NoSQL database
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Mail** - Email functionality
- **Flask-CORS** - Cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **MongoDB** (v4.0 or higher)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd videmaison
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```env
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/videmaison
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
```

> **Note**: For Gmail, you'll need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

#### Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Create Admin User (Optional)
```bash
python create_admin.py
```

#### Start the Backend Server
```bash
python run.py
```
The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Node Dependencies
Open a new terminal and navigate to the project root:
```bash
npm install
```

#### Configure Environment Variables (Optional)
Create a `.env` file in the root directory if you need to customize the API endpoint:
```env
REACT_APP_API_URL=http://localhost:5000
```

#### Start the Development Server
```bash
npm start
```
The application will open at `http://localhost:3000`

## Usage

### Development Mode
1. Start the backend server (see Backend Setup)
2. Start the frontend development server (see Frontend Setup)
3. Navigate to `http://localhost:3000` in your browser

### Admin Access
- Navigate to `/admin/login`
- Use the credentials created with `create_admin.py`
- Access the admin dashboard at `/admin/dashboard`

### Available Scripts

#### Frontend
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

#### Backend
- `python run.py` - Starts the Flask development server
- `python create_admin.py` - Creates an admin user

## Project Structure

```
videmaison/
├── backend/
│   ├── app/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── .env               # Backend environment variables
│   ├── run.py             # Backend entry point
│   └── requirements.txt   # Python dependencies
├── src/
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env                  # Frontend environment variables
└── package.json          # Node dependencies
```

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique values for `SECRET_KEY` and `JWT_SECRET_KEY`
- For production, use environment-specific configuration
- Enable HTTPS in production environments

## Deployment

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `build/` folder.

### Backend Deployment
- Use a production WSGI server like **Gunicorn** or **uWSGI**
- Set `debug=False` in production
- Use environment variables for sensitive configuration

### Frontend Deployment
The build folder can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact: [your-email@example.com]

---

Built with ❤️ using React and Flask
