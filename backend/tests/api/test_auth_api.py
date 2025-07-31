import pytest
import httpx
from fastapi import status

pytestmark = pytest.mark.api

class TestAuthAPI:
    """Test authentication API endpoints."""
    
    @pytest.mark.auth
    async def test_send_mobile_otp_success(self, async_client: httpx.AsyncClient):
        """Test successful mobile OTP sending."""
        response = await async_client.post("/api/auth/send-mobile-otp", json={
            "phone": "+1234567890"
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "otp_sent" in data
    
    @pytest.mark.auth
    async def test_send_mobile_otp_invalid_phone(self, async_client: httpx.AsyncClient):
        """Test mobile OTP sending with invalid phone number."""
        response = await async_client.post("/api/auth/send-mobile-otp", json={
            "phone": "invalid_phone"
        })
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.auth
    async def test_verify_mobile_otp_success(self, async_client: httpx.AsyncClient):
        """Test successful mobile OTP verification."""
        # First send OTP
        await async_client.post("/api/auth/send-mobile-otp", json={
            "phone": "+1234567890"
        })
        
        # Then verify OTP (using test OTP)
        response = await async_client.post("/api/auth/verify-mobile-otp", json={
            "phone": "+1234567890",
            "otp": "123456"
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
    
    @pytest.mark.auth
    async def test_verify_mobile_otp_invalid_otp(self, async_client: httpx.AsyncClient):
        """Test mobile OTP verification with invalid OTP."""
        # First send OTP
        await async_client.post("/api/auth/send-mobile-otp", json={
            "phone": "+1234567890"
        })
        
        # Then verify with invalid OTP
        response = await async_client.post("/api/auth/verify-mobile-otp", json={
            "phone": "+1234567890",
            "otp": "000000"
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.auth
    async def test_send_email_otp_success(self, async_client: httpx.AsyncClient):
        """Test successful email OTP sending."""
        response = await async_client.post("/api/auth/send-otp", json={
            "email": "test@example.com"
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "otp_sent" in data
    
    @pytest.mark.auth
    async def test_verify_email_otp_success(self, async_client: httpx.AsyncClient):
        """Test successful email OTP verification."""
        # First send OTP
        await async_client.post("/api/auth/send-otp", json={
            "email": "test@example.com"
        })
        
        # Then verify OTP
        response = await async_client.post("/api/auth/verify-otp", json={
            "email": "test@example.com",
            "otp": "123456"
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
    
    @pytest.mark.auth
    async def test_get_current_user_authenticated(self, async_client: httpx.AsyncClient, auth_headers):
        """Test getting current user with valid authentication."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/auth/me", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        assert "email" in data or "phone" in data
    
    @pytest.mark.auth
    async def test_get_current_user_unauthenticated(self, async_client: httpx.AsyncClient):
        """Test getting current user without authentication."""
        response = await async_client.get("/api/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.auth
    async def test_logout_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful logout."""
        headers = await auth_headers(async_client)
        
        response = await async_client.post("/api/auth/logout", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data