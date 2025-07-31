#!/bin/bash

echo "🚀 Expo Go Test Runner (Linux)"
echo "==============================="

# Check if we're in the right directory
if [ ! -d "test_automation" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Change to test_automation directory
cd test_automation

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements_pytest.txt
else
    echo "✅ Virtual environment found"
    source venv/bin/activate
fi

# Verify dependencies
echo "🔍 Verifying dependencies..."
python -c "import pytest, appium, selenium, yaml; print('✅ All dependencies are working!')" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Some dependencies are missing. Installing..."
    pip install -r requirements_pytest.txt
fi

# Run the test
echo "🧪 Running Expo test..."
python run_complete_expo_flow.py "$@"

# Deactivate virtual environment
deactivate

echo "✅ Test completed!"