@echo off
echo 🚀 Standalone Expo Test Runner (Windows)
echo ========================================

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

REM Check if standalone test exists
if not exist "standalone_expo_test.py" (
    echo ❌ standalone_expo_test.py not found!
    pause
    exit /b 1
)

REM Run the standalone test
echo.
echo 🧪 Running Standalone Expo Test...
%PYTHON_CMD% standalone_expo_test.py

if %errorlevel% equ 0 (
    echo.
    echo ✅ Standalone test completed successfully!
) else (
    echo.
    echo ❌ Standalone test failed!
)

pause