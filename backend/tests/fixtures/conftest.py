import pytest
import asyncio
import httpx
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
import tempfile
import shutil
from typing import Generator, AsyncGenerator

# Import the FastAPI app
from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

# Test database URL
TEST_DATABASE_URL = "sqlite:///./test_commute_io.db"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_db_engine():
    """Create a test database engine."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine
    engine.dispose()

@pytest.fixture(scope="function")
def test_db_session(test_db_engine):
    """Create a test database session."""
    # Create all tables
    Base.metadata.create_all(bind=test_db_engine)
    
    TestingSessionLocal = sessionmaker(
        autocommit=False, 
        autoflush=False, 
        bind=test_db_engine
    )
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Drop all tables after each test
        Base.metadata.drop_all(bind=test_db_engine)

@pytest.fixture(scope="function")
def client(test_db_session) -> Generator:
    """Create a test client with a test database."""
    def override_get_db():
        try:
            yield test_db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()

@pytest.fixture
async def async_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Create an async test client."""
    async with httpx.AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def test_user_data():
    """Sample user data for testing."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+1234567890",
        "bio": "Test bio",
        "is_driver": True,
        "is_rider": True,
        "preferences": {"music": True, "smoking": False}
    }

@pytest.fixture
def test_ride_data():
    """Sample ride data for testing."""
    return {
        "start_location": "123 Main St, City",
        "end_location": "456 Oak Ave, Town",
        "start_time": "2024-01-15T10:00:00Z",
        "seats_available": 3,
        "total_fare": 25.50,
        "car_id": 1
    }

@pytest.fixture
def test_car_data():
    """Sample car data for testing."""
    return {
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "color": "Silver",
        "license_plate": "ABC123",
        "seats": 5,
        "ac_available": True
    }

@pytest.fixture
def auth_headers():
    """Get authentication headers for testing."""
    async def _get_auth_headers(client: httpx.AsyncClient, user_data: dict = None):
        if user_data is None:
            user_data = {
                "email": "test@example.com",
                "phone": "+1234567890"
            }
        
        # Send OTP
        response = await client.post("/api/auth/send-mobile-otp", json={
            "phone": user_data["phone"]
        })
        
        # For testing, we'll use a mock OTP
        otp = "123456"  # In real scenario, this would come from the backend
        
        # Verify OTP
        response = await client.post("/api/auth/verify-mobile-otp", json={
            "phone": user_data["phone"],
            "otp": otp
        })
        
        if response.status_code == 200:
            data = response.json()
            return {"Authorization": f"Bearer {data['access_token']}"}
        
        return {}
    
    return _get_auth_headers

@pytest.fixture
def temp_dir():
    """Create a temporary directory for file operations."""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)

# Mobile automation fixtures
@pytest.fixture
def appium_driver():
    """Appium driver fixture for mobile automation."""
    from appium import webdriver
    from appium.options.android import UiAutomator2Options
    
    # Appium server configuration
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.automation_name = "UiAutomator2"
    options.device_name = "Android Emulator"
    options.app = "/path/to/your/app.apk"  # Update with actual APK path
    options.no_reset = True
    
    # Connect to Appium server
    driver = webdriver.Remote("http://localhost:4723", options=options)
    yield driver
    driver.quit()

# Web automation fixtures
@pytest.fixture
def selenium_driver():
    """Selenium WebDriver fixture for web automation."""
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    yield driver
    driver.quit()

# Test data fixtures
@pytest.fixture
def sample_users():
    """Sample users for testing."""
    return [
        {
            "name": "John Driver",
            "email": "john@example.com",
            "phone": "+1234567890",
            "is_driver": True,
            "is_rider": False
        },
        {
            "name": "Jane Rider",
            "email": "jane@example.com",
            "phone": "+0987654321",
            "is_driver": False,
            "is_rider": True
        },
        {
            "name": "Bob Both",
            "email": "bob@example.com",
            "phone": "+1122334455",
            "is_driver": True,
            "is_rider": True
        }
    ]

@pytest.fixture
def sample_rides():
    """Sample rides for testing."""
    return [
        {
            "start_location": "Downtown Office",
            "end_location": "Suburban Home",
            "start_time": "2024-01-15T08:00:00Z",
            "seats_available": 2,
            "total_fare": 15.00
        },
        {
            "start_location": "Airport",
            "end_location": "City Center",
            "start_time": "2024-01-15T14:00:00Z",
            "seats_available": 3,
            "total_fare": 30.00
        }
    ]