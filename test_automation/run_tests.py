#!/usr/bin/env python3
"""
Test runner script for Appium + Behave test automation.
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path


def check_prerequisites():
    """Check if all prerequisites are installed."""
    print("Checking prerequisites...")
    
    # Check if Appium server is running
    try:
        import requests
        response = requests.get("http://localhost:4723/wd/hub/status", timeout=5)
        if response.status_code == 200:
            print("✓ Appium server is running")
        else:
            print("✗ Appium server is not responding properly")
            return False
    except Exception:
        print("✗ Appium server is not running on localhost:4723")
        print("  Please start Appium server with: appium --port 4723")
        return False
    
    # Check if ADB can detect device
    try:
        result = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        if "device" in result.stdout and "List of devices" in result.stdout:
            devices = [line for line in result.stdout.split('\n') if '\tdevice' in line]
            if devices:
                print(f"✓ Android device detected: {devices[0].split()[0]}")
            else:
                print("✗ No Android devices detected")
                print("  Please connect your device and enable USB debugging")
                return False
        else:
            print("✗ ADB not working properly")
            return False
    except FileNotFoundError:
        print("✗ ADB not found in PATH")
        print("  Please install Android SDK and add ADB to PATH")
        return False
    except Exception as e:
        print(f"✗ Error checking ADB: {str(e)}")
        return False
    
    # Check if app is installed
    try:
        result = subprocess.run([
            "adb", "shell", "pm", "list", "packages", "com.anonymous.boltexponativewind"
        ], capture_output=True, text=True)
        
        if "com.anonymous.boltexponativewind" in result.stdout:
            print("✓ App is installed on device")
        else:
            print("✗ App 'com.anonymous.boltexponativewind' is not installed")
            print("  Please install the app on your device first")
            return False
    except Exception as e:
        print(f"✗ Error checking app installation: {str(e)}")
        return False
    
    return True


def install_dependencies():
    """Install required Python dependencies."""
    print("Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True)
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False
    except FileNotFoundError:
        print("✗ requirements.txt not found")
        return False
    return True


def run_tests(tags=None, feature=None, format_type="pretty", output_dir="allure-results"):
    """Run Behave tests with specified parameters."""
    cmd = ["behave"]
    
    # Add format
    if format_type == "allure":
        cmd.extend(["-f", "allure_behave.formatter:AllureFormatter", "-o", output_dir])
    else:
        cmd.extend(["-f", format_type])
    
    # Add tags if specified
    if tags:
        cmd.extend(["--tags", tags])
    
    # Add specific feature if specified
    if feature:
        cmd.append(f"features/{feature}")
    
    # Add verbose output
    cmd.extend(["--no-capture", "--show-timings"])
    
    print(f"Running command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, cwd="test_automation")
        return result.returncode == 0
    except FileNotFoundError:
        print("✗ Behave not found. Please install with: pip install behave")
        return False
    except Exception as e:
        print(f"✗ Error running tests: {str(e)}")
        return False


def generate_allure_report(results_dir="allure-results", report_dir="allure-report"):
    """Generate and serve Allure report."""
    print("Generating Allure report...")
    
    try:
        # Generate report
        subprocess.run(["allure", "generate", results_dir, "-o", report_dir, "--clean"], 
                      check=True, cwd="test_automation")
        print(f"✓ Report generated in {report_dir}")
        
        # Serve report
        print("Starting Allure server...")
        subprocess.run(["allure", "serve", results_dir], cwd="test_automation")
        
    except FileNotFoundError:
        print("✗ Allure not found. Please install Allure CLI")
        print("  Download from: https://github.com/allure-framework/allure2/releases")
        return False
    except subprocess.CalledProcessError as e:
        print(f"✗ Error generating report: {str(e)}")
        return False
    
    return True


def main():
    """Main function to parse arguments and run tests."""
    parser = argparse.ArgumentParser(description="Run Appium + Behave tests")
    
    parser.add_argument("--check", action="store_true", 
                       help="Check prerequisites only")
    parser.add_argument("--install", action="store_true", 
                       help="Install dependencies")
    parser.add_argument("--tags", type=str, 
                       help="Run tests with specific tags (e.g., '@smoke')")
    parser.add_argument("--feature", type=str, 
                       help="Run specific feature file (e.g., 'onboarding.feature')")
    parser.add_argument("--format", type=str, default="pretty", 
                       choices=["pretty", "plain", "json", "allure"],
                       help="Output format")
    parser.add_argument("--report", action="store_true", 
                       help="Generate and serve Allure report after tests")
    
    # Predefined test suites
    parser.add_argument("--smoke", action="store_true", 
                       help="Run smoke tests only")
    parser.add_argument("--regression", action="store_true", 
                       help="Run all tests")
    parser.add_argument("--auth", action="store_true", 
                       help="Run authentication tests only")
    parser.add_argument("--ride", action="store_true", 
                       help="Run ride booking tests only")
    
    args = parser.parse_args()
    
    # Change to test automation directory
    os.chdir(Path(__file__).parent)
    
    # Check prerequisites if requested or if no other action specified
    if args.check or not any([args.install, args.tags, args.feature, 
                             args.smoke, args.regression, args.auth, args.ride]):
        if not check_prerequisites():
            sys.exit(1)
        if args.check:
            print("All prerequisites are met!")
            sys.exit(0)
    
    # Install dependencies if requested
    if args.install:
        if not install_dependencies():
            sys.exit(1)
    
    # Determine which tests to run
    tags = None
    feature = None
    format_type = args.format
    
    if args.smoke:
        tags = "@smoke"
    elif args.auth:
        tags = "@authentication"
    elif args.ride:
        tags = "@ride_booking"
    elif args.regression:
        # Run all tests
        pass
    elif args.tags:
        tags = args.tags
    elif args.feature:
        feature = args.feature
    
    # Set format to allure if report is requested
    if args.report:
        format_type = "allure"
    
    # Run tests
    print("Starting test execution...")
    success = run_tests(tags=tags, feature=feature, format_type=format_type)
    
    if not success:
        print("Tests failed!")
        sys.exit(1)
    
    # Generate report if requested
    if args.report:
        generate_allure_report()
    
    print("Test execution completed successfully!")


if __name__ == "__main__":
    main()