#!/bin/bash

echo "🚀 Running Expo Test with Virtual Environment"
echo "============================================="

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
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "📦 Checking dependencies..."
pip install -r requirements_pytest.txt

# Run the test
echo "🧪 Running the test..."
python run_complete_expo_flow.py "$@"

# Deactivate virtual environment
deactivate

echo "✅ Test completed!"