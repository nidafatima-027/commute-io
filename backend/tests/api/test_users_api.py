import pytest
import httpx
from fastapi import status

pytestmark = pytest.mark.api

class TestUsersAPI:
    """Test users API endpoints."""
    
    @pytest.mark.auth
    async def test_get_user_profile_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user profile retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/users/profile", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "id" in data
        assert "name" in data or "email" in data or "phone" in data
    
    @pytest.mark.auth
    async def test_get_user_profile_unauthenticated(self, async_client: httpx.AsyncClient):
        """Test user profile retrieval without authentication."""
        response = await async_client.get("/api/users/profile")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.auth
    async def test_update_user_profile_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user profile update."""
        headers = await auth_headers(async_client)
        
        update_data = {
            "name": "Updated Test User",
            "bio": "Updated bio from automation test",
            "is_driver": True,
            "is_rider": True
        }
        
        response = await async_client.put("/api/users/profile", json=update_data, headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["bio"] == update_data["bio"]
    
    @pytest.mark.auth
    async def test_update_user_profile_invalid_data(self, async_client: httpx.AsyncClient, auth_headers):
        """Test user profile update with invalid data."""
        headers = await auth_headers(async_client)
        
        invalid_data = {
            "name": "",  # Empty name
            "email": "invalid-email",  # Invalid email
            "phone": "invalid-phone"  # Invalid phone
        }
        
        response = await async_client.put("/api/users/profile", json=invalid_data, headers=headers)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.auth
    async def test_get_user_by_id_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user retrieval by ID."""
        headers = await auth_headers(async_client)
        
        # First get current user to get a valid user ID
        current_user_response = await async_client.get("/api/users/profile", headers=headers)
        user_id = current_user_response.json()["id"]
        
        response = await async_client.get(f"/api/users/{user_id}", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == user_id
    
    @pytest.mark.auth
    async def test_get_user_by_id_not_found(self, async_client: httpx.AsyncClient, auth_headers):
        """Test user retrieval by non-existent ID."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/users/99999", headers=headers)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    @pytest.mark.auth
    async def test_get_user_preferences_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user preferences retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/users/preferences", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, dict)
    
    @pytest.mark.auth
    async def test_update_user_preferences_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user preferences update."""
        headers = await auth_headers(async_client)
        
        preferences_data = {
            "music": True,
            "smoking": False,
            "pets": True,
            "conversation": "preferred"
        }
        
        response = await async_client.put("/api/users/preferences", json=preferences_data, headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["music"] == preferences_data["music"]
        assert data["smoking"] == preferences_data["smoking"]
    
    @pytest.mark.auth
    async def test_get_user_schedule_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user schedule retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/users/schedule", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.auth
    async def test_create_user_schedule_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user schedule creation."""
        headers = await auth_headers(async_client)
        
        schedule_data = {
            "day_of_week": 1,  # Monday
            "start_time": "08:00:00",
            "end_time": "17:00:00"
        }
        
        response = await async_client.post("/api/users/schedule", json=schedule_data, headers=headers)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["day_of_week"] == schedule_data["day_of_week"]
    
    @pytest.mark.auth
    async def test_delete_user_schedule_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful user schedule deletion."""
        headers = await auth_headers(async_client)
        
        # First create a schedule
        schedule_data = {
            "day_of_week": 2,  # Tuesday
            "start_time": "09:00:00",
            "end_time": "18:00:00"
        }
        
        create_response = await async_client.post("/api/users/schedule", json=schedule_data, headers=headers)
        schedule_id = create_response.json()["id"]
        
        # Then delete it
        response = await async_client.delete(f"/api/users/schedule/{schedule_id}", headers=headers)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT