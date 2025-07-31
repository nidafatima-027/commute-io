#!/usr/bin/env python3
"""
Comprehensive test runner for the Commute.io carpooling application.

This script provides various options for running different types of tests:
- API tests
- Mobile automation tests
- Unit tests
- Integration tests
- All tests with coverage

Usage:
    python run_tests.py [options]

Options:
    --api              Run API tests only
    --mobile           Run mobile automation tests only
    --unit             Run unit tests only
    --integration      Run integration tests only
    --all              Run all tests
    --coverage         Run tests with coverage report
    --verbose          Run with verbose output
    --parallel         Run tests in parallel
    --markers          Show available test markers
    --help             Show this help message
"""

import os
import sys
import subprocess
import argparse
import time
from pathlib import Path

class TestRunner:
    """Test runner for the Commute.io application."""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.tests_dir = self.project_root / "tests"
        self.coverage_dir = self.project_root / "htmlcov"
        
    def run_command(self, command, description=""):
        """Run a command and handle errors."""
        print(f"\n🚀 {description}")
        print(f"📝 Command: {' '.join(command)}")
        print("-" * 60)
        
        start_time = time.time()
        
        try:
            result = subprocess.run(
                command,
                cwd=self.project_root,
                check=True,
                capture_output=False,
                text=True
            )
            
            end_time = time.time()
            duration = end_time - start_time
            
            print(f"\n✅ {description} completed successfully in {duration:.2f} seconds")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"\n❌ {description} failed with exit code {e.returncode}")
            return False
        except FileNotFoundError:
            print(f"\n❌ Command not found: {command[0]}")
            print("   Please ensure pytest is installed: pip install pytest")
            return False
    
    def check_prerequisites(self):
        """Check if all prerequisites are met."""
        print("🔍 Checking prerequisites...")
        
        # Check if pytest is installed
        try:
            subprocess.run(["pytest", "--version"], capture_output=True, check=True)
            print("✅ pytest is installed")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ pytest is not installed")
            print("   Installing pytest and dependencies...")
            self.install_dependencies()
        
        # Check if tests directory exists
        if not self.tests_dir.exists():
            print("❌ Tests directory not found")
            return False
        
        print("✅ All prerequisites met")
        return True
    
    def install_dependencies(self):
        """Install test dependencies."""
        print("📦 Installing test dependencies...")
        
        requirements_file = self.project_root / "requirements.txt"
        if requirements_file.exists():
            self.run_command(
                ["pip", "install", "-r", "requirements.txt"],
                "Installing Python dependencies"
            )
        else:
            print("⚠️ requirements.txt not found")
    
    def run_api_tests(self, verbose=False, coverage=False):
        """Run API tests."""
        command = ["pytest", "tests/api/", "-m", "api"]
        
        if verbose:
            command.append("-v")
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=term-missing"])
        
        return self.run_command(command, "Running API tests")
    
    def run_mobile_tests(self, verbose=False, coverage=False):
        """Run mobile automation tests."""
        command = ["pytest", "tests/mobile/", "-m", "mobile"]
        
        if verbose:
            command.append("-v")
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=term-missing"])
        
        return self.run_command(command, "Running mobile automation tests")
    
    def run_unit_tests(self, verbose=False, coverage=False):
        """Run unit tests."""
        command = ["pytest", "tests/unit/", "-m", "unit"]
        
        if verbose:
            command.append("-v")
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=term-missing"])
        
        return self.run_command(command, "Running unit tests")
    
    def run_integration_tests(self, verbose=False, coverage=False):
        """Run integration tests."""
        command = ["pytest", "tests/integration/", "-m", "integration"]
        
        if verbose:
            command.append("-v")
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=term-missing"])
        
        return self.run_command(command, "Running integration tests")
    
    def run_all_tests(self, verbose=False, coverage=False, parallel=False):
        """Run all tests."""
        command = ["pytest", "tests/"]
        
        if verbose:
            command.append("-v")
        
        if coverage:
            command.extend(["--cov=app", "--cov-report=html", "--cov-report=term-missing"])
        
        if parallel:
            command.extend(["-n", "auto"])
        
        return self.run_command(command, "Running all tests")
    
    def show_markers(self):
        """Show available test markers."""
        print("📋 Available test markers:")
        print("-" * 40)
        
        markers = [
            "unit - Unit tests",
            "integration - Integration tests", 
            "api - API tests",
            "mobile - Mobile automation tests",
            "auth - Authentication tests",
            "rides - Ride management tests",
            "messages - Messaging tests",
            "slow - Slow running tests"
        ]
        
        for marker in markers:
            print(f"  {marker}")
    
    def open_coverage_report(self):
        """Open coverage report in browser."""
        coverage_file = self.coverage_dir / "index.html"
        
        if coverage_file.exists():
            print(f"\n📊 Opening coverage report: {coverage_file}")
            
            import webbrowser
            webbrowser.open(f"file://{coverage_file.absolute()}")
        else:
            print("⚠️ Coverage report not found. Run tests with --coverage first.")
    
    def setup_mobile_environment(self):
        """Setup mobile testing environment."""
        print("📱 Setting up mobile testing environment...")
        
        # Check if Appium is installed
        try:
            subprocess.run(["appium", "--version"], capture_output=True, check=True)
            print("✅ Appium is installed")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("⚠️ Appium is not installed")
            print("   Please install Appium: npm install -g appium")
        
        # Check if Android SDK is available
        android_home = os.getenv("ANDROID_HOME")
        if android_home:
            print(f"✅ Android SDK found at: {android_home}")
        else:
            print("⚠️ ANDROID_HOME environment variable not set")
        
        # Check if APK file exists
        apk_paths = [
            self.project_root / "app.apk",
            self.project_root.parent / "app.apk",
            self.project_root.parent.parent / "app.apk"
        ]
        
        for apk_path in apk_paths:
            if apk_path.exists():
                print(f"✅ APK file found at: {apk_path}")
                os.environ["APK_PATH"] = str(apk_path)
                break
        else:
            print("⚠️ APK file not found. Please provide APK_PATH environment variable.")
    
    def run(self, args):
        """Main run method."""
        print("🚀 Commute.io Test Runner")
        print("=" * 50)
        
        # Check prerequisites
        if not self.check_prerequisites():
            return False
        
        success = True
        
        # Setup mobile environment if needed
        if args.mobile or args.all:
            self.setup_mobile_environment()
        
        # Run tests based on arguments
        if args.api:
            success &= self.run_api_tests(args.verbose, args.coverage)
        
        if args.mobile:
            success &= self.run_mobile_tests(args.verbose, args.coverage)
        
        if args.unit:
            success &= self.run_unit_tests(args.verbose, args.coverage)
        
        if args.integration:
            success &= self.run_integration_tests(args.verbose, args.coverage)
        
        if args.all:
            success &= self.run_all_tests(args.verbose, args.coverage, args.parallel)
        
        if args.markers:
            self.show_markers()
            return True
        
        # Open coverage report if requested
        if args.coverage and success:
            self.open_coverage_report()
        
        # Print summary
        print("\n" + "=" * 50)
        if success:
            print("🎉 All tests completed successfully!")
        else:
            print("❌ Some tests failed. Please check the output above.")
        
        return success

def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description="Test runner for Commute.io carpooling application",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument("--api", action="store_true", help="Run API tests only")
    parser.add_argument("--mobile", action="store_true", help="Run mobile automation tests only")
    parser.add_argument("--unit", action="store_true", help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", help="Run integration tests only")
    parser.add_argument("--all", action="store_true", help="Run all tests")
    parser.add_argument("--coverage", action="store_true", help="Run tests with coverage report")
    parser.add_argument("--verbose", "-v", action="store_true", help="Run with verbose output")
    parser.add_argument("--parallel", action="store_true", help="Run tests in parallel")
    parser.add_argument("--markers", action="store_true", help="Show available test markers")
    
    args = parser.parse_args()
    
    # If no specific test type is specified, run all tests
    if not any([args.api, args.mobile, args.unit, args.integration, args.all, args.markers]):
        args.all = True
    
    runner = TestRunner()
    success = runner.run(args)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()