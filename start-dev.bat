@echo off
REM Commute.io Development Environment Startup Script for Windows

echo 🚀 Starting Commute.io Development Environment
echo ==============================================

REM Check prerequisites
echo 🔍 Checking prerequisites...

python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Start backend
echo.
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Run database migrations
echo 🗄️ Setting up database...
alembic upgrade head

REM Start backend server
echo 🚀 Starting backend server...
start "Backend Server" python run_server.py

REM Go back to root directory
cd ..

REM Start frontend
echo.
echo 📱 Setting up frontend...

REM Install Node.js dependencies
echo 📥 Installing Node.js dependencies...
npm install

REM Start frontend
echo 🚀 Starting frontend...
start "Frontend Server" npm run dev

echo.
echo ✅ Development environment started successfully!
echo ==============================================
echo 🔗 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 📱 Frontend: http://localhost:8081
echo.
echo Press any key to stop all servers...
pause >nul

REM Cleanup (this won't work perfectly on Windows, but provides some guidance)
echo 🛑 Please manually close the Backend Server and Frontend Server windows
echo ✅ Development environment stopped