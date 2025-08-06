import pytest
import httpx
from fastapi import status

pytestmark = pytest.mark.api

class TestRidesAPI:
    """Test rides API endpoints."""
    
    @pytest.mark.rides
    async def test_search_rides_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful ride search."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/rides/", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.rides
    async def test_search_rides_unauthenticated(self, async_client: httpx.AsyncClient):
        """Test ride search without authentication."""
        response = await async_client.get("/api/rides/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.rides
    async def test_create_ride_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride creation."""
        headers = await auth_headers(async_client)
        
        response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "id" in data
        assert data["start_location"] == test_ride_data["start_location"]
        assert data["end_location"] == test_ride_data["end_location"]
    
    @pytest.mark.rides
    async def test_create_ride_invalid_data(self, async_client: httpx.AsyncClient, auth_headers):
        """Test ride creation with invalid data."""
        headers = await auth_headers(async_client)
        
        invalid_data = {
            "start_location": "",  # Empty location
            "end_location": "Test End",
            "start_time": "invalid_time",
            "seats_available": -1,  # Invalid seats
            "total_fare": -10.0  # Invalid fare
        }
        
        response = await async_client.post("/api/rides/", json=invalid_data, headers=headers)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.rides
    async def test_get_ride_details_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride details retrieval."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then get ride details
        response = await async_client.get(f"/api/rides/{ride_id}", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == ride_id
        assert "start_location" in data
        assert "end_location" in data
    
    @pytest.mark.rides
    async def test_get_ride_details_not_found(self, async_client: httpx.AsyncClient, auth_headers):
        """Test ride details retrieval for non-existent ride."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/rides/99999", headers=headers)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    @pytest.mark.rides
    async def test_request_ride_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride request."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then request the ride
        request_data = {
            "message": "Can I join your ride?"
        }
        
        response = await async_client.post(f"/api/rides/{ride_id}/request", json=request_data, headers=headers)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "id" in data
        assert data["ride_id"] == ride_id
    
    @pytest.mark.rides
    async def test_get_ride_requests_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride requests retrieval."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then get ride requests
        response = await async_client.get(f"/api/rides/{ride_id}/requests", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.rides
    async def test_update_ride_request_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride request update."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then request the ride
        request_response = await async_client.post(f"/api/rides/{ride_id}/request", 
                                                  json={"message": "Test request"}, 
                                                  headers=headers)
        request_id = request_response.json()["id"]
        
        # Then update the request status
        update_data = {"status": "accepted"}
        response = await async_client.put(f"/api/rides/requests/{request_id}", 
                                         json=update_data, 
                                         headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "accepted"
    
    @pytest.mark.rides
    async def test_get_my_rides_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful retrieval of user's rides."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        
        # Then get user's rides
        response = await async_client.get("/api/rides/my-rides", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.rides
    async def test_update_ride_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride update."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then update the ride
        update_data = {
            "seats_available": 2,
            "start_time": "2024-01-15T11:00:00Z"
        }
        
        response = await async_client.put(f"/api/rides/{ride_id}", json=update_data, headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["seats_available"] == 2
    
    @pytest.mark.rides
    async def test_delete_ride_success(self, async_client: httpx.AsyncClient, auth_headers, test_ride_data):
        """Test successful ride deletion."""
        headers = await auth_headers(async_client)
        
        # First create a ride
        create_response = await async_client.post("/api/rides/", json=test_ride_data, headers=headers)
        ride_id = create_response.json()["id"]
        
        # Then delete the ride
        response = await async_client.delete(f"/api/rides/{ride_id}", headers=headers)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
    
    @pytest.mark.rides
    async def test_get_ride_history_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful ride history retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/rides/history", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)