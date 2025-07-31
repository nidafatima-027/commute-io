@echo off
echo 🚀 Complete Expo Flow Test Runner (Windows)
echo ============================================

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

REM Run the test
echo.
echo 🧪 Starting Expo Flow Test...
%PYTHON_CMD% run_expo_test.py %*

if %errorlevel% equ 0 (
    echo.
    echo ✅ Test completed successfully!
) else (
    echo.
    echo ❌ Test failed!
)

pause