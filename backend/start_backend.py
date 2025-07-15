#!/usr/bin/env python3
"""
Quick start script for the backend server
"""
import os
import sys
import subprocess

def check_python():
    """Check if Python 3.8+ is available"""
    try:
        import sys
        if sys.version_info < (3, 8):
            print("❌ Python 3.8 or higher is required")
            return False
        return True
    except:
        return False

def setup_virtual_env():
    """Set up virtual environment if it doesn't exist"""
    if not os.path.exists('venv'):
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', 'venv'])
        print("✅ Virtual environment created")
    
    # Activate virtual environment
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate.bat'
        pip_path = 'venv\\Scripts\\pip'
        python_path = 'venv\\Scripts\\python'
    else:  # Unix/Linux/macOS
        activate_script = 'venv/bin/activate'
        pip_path = 'venv/bin/pip'
        python_path = 'venv/bin/python'
    
    return python_path, pip_path

def install_dependencies(pip_path):
    """Install required dependencies"""
    print("📥 Installing dependencies...")
    subprocess.run([pip_path, 'install', '-r', 'requirements.txt'])
    print("✅ Dependencies installed")

def setup_database(python_path):
    """Set up database with Alembic"""
    print("🗄️ Setting up database...")
    try:
        subprocess.run([python_path, '-m', 'alembic', 'upgrade', 'head'])
        print("✅ Database setup complete")
    except:
        print("⚠️ Database setup skipped (Alembic not configured)")

def start_server(python_path):
    """Start the FastAPI server"""
    print("🚀 Starting backend server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("=" * 50)
    
    subprocess.run([python_path, 'run_server.py'])

def main():
    if not check_python():
        sys.exit(1)
    
    print("🚀 Starting Commute.io Backend Server")
    print("=" * 40)
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    python_path, pip_path = setup_virtual_env()
    install_dependencies(pip_path)
    setup_database(python_path)
    start_server(python_path)

if __name__ == "__main__":
    main()