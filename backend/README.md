# Commute.io Backend API

A FastAPI backend for the Commute.io rideshare application with proper architecture and PostgreSQL database.

## 🏗️ Architecture

```
my_backend/
├── app/
│   ├── api/          # API routes and endpoints
│   ├── schema/       # Pydantic schemas (request/response DTOs)
│   ├── db/           # Database models and CRUD logic
│   │   ├── models/   # SQLAlchemy models
│   │   └── crud/     # CRUD operations
│   ├── middleware/   # Custom middlewares
│   ├── core/         # Core config, database connection, settings
│   └── main.py       # Entry point
├── alembic/          # Database migrations
├── .env              # Environment variables
├── requirements.txt  # Python dependencies
└── README.md
```

## 🚀 Features

- **Clean Architecture** - Separation of concerns with proper layering
- **PostgreSQL Database** - Production-ready database with proper configuration
- **Database Models** - Based on the provided ERD diagram
- **Authentication** - JWT tokens with OTP verification
- **CRUD Operations** - Complete CRUD for all entities
- **API Documentation** - Auto-generated with FastAPI
- **Database Migrations** - Using Alembic
- **Type Safety** - Full Pydantic validation

## 📊 Database Schema

Based on the ERD diagram:

- **Users** - User profiles with roles (rider/driver/both)
- **Cars** - Vehicle information linked to users
- **Rides** - Ride offers with location and timing
- **Ride Requests** - Join requests for rides
- **Messages** - Chat system between users
- **Preferred Locations** - Saved user locations
- **Schedules** - User availability schedules
- **Ride History** - Completed rides with ratings

## 🔧 Setup

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (optional, for caching)

### Installation

1. **Clone and navigate to backend:**
```bash
cd my_backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL database:**
```sql
CREATE DATABASE commute_io;
CREATE USER commute_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE commute_io TO commute_user;
```

5. **Configure environment:**
```bash
# Edit .env file with your database credentials
DATABASE_URL=postgresql://commute_user:your_password@localhost:5432/commute_io
```

6. **Initialize database migrations:**
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

7. **Run the server:**
```bash
python -m app.main
# or
uvicorn app.main:app --reload
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/schedule` - Get user schedule
- `POST /api/users/schedule` - Create schedule
- `GET /api/users/locations` - Get saved locations
- `POST /api/users/locations` - Add location

### Cars
- `GET /api/cars/` - Get user cars
- `POST /api/cars/` - Add new car
- `PUT /api/cars/{car_id}` - Update car
- `DELETE /api/cars/{car_id}` - Delete car

### Rides
- `GET /api/rides/` - Search available rides
- `POST /api/rides/` - Create new ride
- `GET /api/rides/my-rides` - Get user's rides
- `GET /api/rides/{ride_id}` - Get ride details
- `PUT /api/rides/{ride_id}` - Update ride
- `POST /api/rides/request` - Request to join ride
- `GET /api/rides/{ride_id}/requests` - Get ride requests
- `PUT /api/rides/requests/{request_id}` - Accept/reject request

### Messages
- `POST /api/messages/` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/{user_id}` - Get conversation with user

### Locations
- `GET /api/locations/` - Get user locations
- `POST /api/locations/` - Create location

## 🔄 Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🚀 Production Deployment

1. **Set up PostgreSQL database**
2. **Configure environment variables**
3. **Run migrations**
4. **Use Gunicorn for production**

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📱 Frontend Integration

Update your React Native app to use the backend:

```typescript
// services/api.ts
const API_BASE_URL = 'http://localhost:8000/api';

export const apiService = {
  // Auth
  login: (email: string, password: string) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),

  // Rides
  getRides: (token: string) =>
    fetch(`${API_BASE_URL}/rides/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Messages
  getConversations: (token: string) =>
    fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
};
```

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy
- CORS configuration
- Environment variable management

## 📝 Environment Variables

Required environment variables in `.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/commute_io
SECRET_KEY=your-super-secret-key
FRONTEND_URL=http://localhost:8081
REDIS_URL=redis://localhost:6379
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📄 License

This project is licensed under the MIT License.