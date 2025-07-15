# Commute.io - Rideshare Application

A modern rideshare application built with React Native (Expo) frontend and FastAPI backend.

## 🏗️ Architecture

- **Frontend**: React Native with Expo Router
- **Backend**: FastAPI with SQLAlchemy
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with OTP verification

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Development Setup

#### Option 1: Automated Setup (Recommended)

**For macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**For Windows:**
```cmd
start-dev.bat
```

#### Option 2: Manual Setup

**Backend Setup:**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
alembic upgrade head

# Start server
python run_server.py
```

**Frontend Setup:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 Features

### Authentication
- Email/Phone OTP verification
- JWT token management
- User profile setup

### Ride Management
- Create and search rides
- Join ride requests
- Real-time messaging
- Ride history and ratings

### User Features
- Profile management
- Preferred locations
- Daily schedules
- Car management (for drivers)

## 🔧 Configuration

### Backend Configuration

Create `backend/.env` file:
```env
DATABASE_URL=sqlite:///./commute_io.db
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:8081
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Configuration

The frontend automatically detects the backend URL based on your development environment.

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Rides
- `GET /api/rides/` - Search rides
- `POST /api/rides/` - Create ride
- `POST /api/rides/request` - Request to join ride

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/` - Send message

## 📱 Mobile Development

### Running on Device

**iOS:**
```bash
npm run dev
# Scan QR code with Camera app
```

**Android:**
```bash
npm run dev
# Scan QR code with Expo Go app
```

### Building for Production

```bash
# Web build
npm run build:web

# Mobile builds require Expo Application Services (EAS)
npx eas build --platform ios
npx eas build --platform android
```

## 🗄️ Database

### Development
Uses SQLite for easy development setup.

### Production
Configure PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/commute_io
```

### Migrations
```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Deploy with Gunicorn:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment
```bash
# Build for web
npm run build:web

# Deploy to Netlify, Vercel, or similar
```

## 🔒 Security Features

- JWT authentication
- Password hashing
- Input validation
- CORS configuration
- SQL injection protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Python version (3.8+)
- Ensure virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

**Frontend not connecting to backend:**
- Ensure backend is running on port 8000
- Check network configuration for mobile devices
- Verify API_BASE_URL in services/api.ts

**Database issues:**
- Run migrations: `alembic upgrade head`
- Check database permissions
- Verify DATABASE_URL in .env

### Getting Help

- Check the API documentation at http://localhost:8000/docs
- Review console logs for error messages
- Ensure all prerequisites are installed

## 📞 Support

For support and questions, please open an issue in the repository.