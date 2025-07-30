@echo off
REM Windows batch file to run Appium + Behave tests

echo ========================================
echo  Commute.io Test Automation Runner
echo ========================================

REM Check if we're in the right directory
if not exist "requirements.txt" (
    echo Error: Please run this from the test_automation directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Parse command line arguments
set "COMMAND=%1"
set "EXTRA_ARGS=%2 %3 %4 %5 %6 %7 %8 %9"

if "%COMMAND%"=="" (
    echo Usage: run_tests.bat [command] [options]
    echo.
    echo Commands:
    echo   test      - Test framework components
    echo   check     - Check prerequisites 
    echo   smoke     - Run smoke tests
    echo   auth      - Run authentication tests
    echo   ride      - Run ride booking tests
    echo   all       - Run all tests
    echo   install   - Install dependencies
    echo   help      - Show this help
    echo.
    echo Examples:
    echo   run_tests.bat test
    echo   run_tests.bat check
    echo   run_tests.bat smoke
    echo   run_tests.bat auth
    pause
    exit /b 0
)

if /i "%COMMAND%"=="help" (
    goto :show_help
)

if /i "%COMMAND%"=="test" (
    echo Testing framework components...
    python test_basic.py
    goto :end
)

if /i "%COMMAND%"=="install" (
    echo Installing dependencies...
    python -m pip install -r requirements.txt
    goto :end
)

if /i "%COMMAND%"=="check" (
    echo Checking prerequisites...
    python run_tests.py --check
    goto :end
)

if /i "%COMMAND%"=="smoke" (
    echo Running smoke tests...
    python run_tests.py --smoke
    goto :end
)

if /i "%COMMAND%"=="auth" (
    echo Running authentication tests...
    python run_tests.py --auth
    goto :end
)

if /i "%COMMAND%"=="ride" (
    echo Running ride booking tests...
    python run_tests.py --ride
    goto :end
)

if /i "%COMMAND%"=="all" (
    echo Running all tests...
    python run_tests.py --regression
    goto :end
)

REM Default case - try to pass through to Python script
echo Running: python run_tests.py %COMMAND% %EXTRA_ARGS%
python run_tests.py %COMMAND% %EXTRA_ARGS%

:end
echo.
echo Test execution completed.
if errorlevel 1 (
    echo Status: FAILED
) else (
    echo Status: SUCCESS
)
pause
exit /b %errorlevel%

:show_help
echo ========================================
echo  Commute.io Test Automation Help
echo ========================================
echo.
echo This batch file helps you run the Appium + Behave test framework.
echo.
echo Prerequisites:
echo 1. Python 3.8+ installed
echo 2. Appium server running: appium --port 4723
echo 3. Android device connected via USB
echo 4. Commute.io app installed on device
echo.
echo Quick Start:
echo 1. run_tests.bat install    (install dependencies)
echo 2. run_tests.bat test       (test framework)
echo 3. run_tests.bat check      (check device/appium)
echo 4. run_tests.bat smoke      (run basic tests)
echo.
echo For more options: python run_tests.py --help
pause
exit /b 0