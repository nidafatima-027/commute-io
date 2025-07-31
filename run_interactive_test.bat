@echo off
echo 🚀 Interactive Expo Test Runner (Windows)
echo =========================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Trying python3...
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Python3 not found. Trying py...
        py --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo ❌ No Python installation found!
            echo Please install Python and try again.
            pause
            exit /b 1
        ) else (
            set PYTHON_CMD=py
        )
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

echo ✅ Using Python command: %PYTHON_CMD%

REM Check if test_automation directory exists
if not exist "test_automation" (
    echo ❌ test_automation directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Change to test_automation directory
cd test_automation

REM Check if interactive test exists
if not exist "interactive_expo_test.py" (
    echo ❌ interactive_expo_test.py not found!
    pause
    exit /b 1
)

echo.
echo 📱 INTERACTIVE TEST INSTRUCTIONS:
echo =================================
echo 1. Make sure your Expo Go app is open
echo 2. The test will tap buttons and fill forms automatically
echo 3. Watch the app as it navigates through screens
echo 4. The test will enter test data in forms
echo.
echo Press Enter when ready to start the interactive test...

pause

REM Run the interactive test
echo.
echo 🧪 Running Interactive Expo Test...
%PYTHON_CMD% interactive_expo_test.py

if %errorlevel% equ 0 (
    echo.
    echo ✅ Interactive test completed successfully!
) else (
    echo.
    echo ❌ Interactive test failed!
)

pause