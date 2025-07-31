#!/bin/bash

echo "🚀 Setting up APK Testing Environment"
echo "====================================="

# Check if backend is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Backend server is running on localhost:8000"
else
    echo "❌ Backend server is not running"
    echo "📋 Starting backend server..."
    cd backend
    python start_backend.py &
    cd ..
    sleep 5
fi

# Get computer's IP address
echo "🌐 Getting your computer's IP address..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP_ADDRESS=$(hostname -I | awk '{print $1}')
else
    # Windows (Git Bash)
    IP_ADDRESS=$(ipconfig | grep "IPv4" | head -n 1 | awk '{print $NF}')
fi

echo "📍 Your computer's IP address: $IP_ADDRESS"

# Test backend connectivity
echo "🔍 Testing backend connectivity..."
if curl -s http://$IP_ADDRESS:8000/api/health > /dev/null; then
    echo "✅ Backend is accessible from network"
else
    echo "⚠️ Backend might not be accessible from network"
    echo "💡 Make sure your firewall allows connections on port 8000"
fi

echo ""
echo "📱 APK Testing Setup Complete!"
echo "=============================="
echo ""
echo "For Android Emulator:"
echo "  - Use IP: 10.0.2.2 (already configured)"
echo ""
echo "For Physical Device:"
echo "  - Use IP: $IP_ADDRESS"
echo "  - Open the app and go to: Debug > Network"
echo "  - Enter the IP address above"
echo "  - Test the connection"
echo ""
echo "🔧 To rebuild APK with these changes:"
echo "  npx expo build:android"
echo ""
echo "📋 Troubleshooting:"
echo "  - Make sure device and computer are on same network"
echo "  - Check firewall settings"
echo "  - Verify backend is running: http://localhost:8000/api/health"