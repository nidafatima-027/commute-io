import pytest
import httpx
from fastapi import status

pytestmark = pytest.mark.api

class TestMessagesAPI:
    """Test messages API endpoints."""
    
    @pytest.mark.messages
    async def test_send_message_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful message sending."""
        headers = await auth_headers(async_client)
        
        # First get current user to get user ID
        current_user_response = await async_client.get("/api/users/profile", headers=headers)
        sender_id = current_user_response.json()["id"]
        
        # Send message to another user (using a different user ID)
        receiver_id = sender_id + 1  # This would be a different user in real scenario
        
        message_data = {
            "receiver_id": receiver_id,
            "content": "Hello! This is a test message from automation.",
            "ride_id": None  # Optional
        }
        
        response = await async_client.post("/api/messages/", json=message_data, headers=headers)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "id" in data
        assert data["content"] == message_data["content"]
        assert data["sender_id"] == sender_id
        assert data["receiver_id"] == receiver_id
    
    @pytest.mark.messages
    async def test_send_message_invalid_data(self, async_client: httpx.AsyncClient, auth_headers):
        """Test message sending with invalid data."""
        headers = await auth_headers(async_client)
        
        invalid_data = {
            "receiver_id": 99999,  # Non-existent user
            "content": "",  # Empty content
        }
        
        response = await async_client.post("/api/messages/", json=invalid_data, headers=headers)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.messages
    async def test_get_conversations_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful conversations retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/messages/conversations", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.messages
    async def test_get_conversations_unauthenticated(self, async_client: httpx.AsyncClient):
        """Test conversations retrieval without authentication."""
        response = await async_client.get("/api/messages/conversations")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.messages
    async def test_get_conversation_with_user_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful conversation retrieval with specific user."""
        headers = await auth_headers(async_client)
        
        # First get current user to get user ID
        current_user_response = await async_client.get("/api/users/profile", headers=headers)
        current_user_id = current_user_response.json()["id"]
        
        # Get conversation with another user
        other_user_id = current_user_id + 1
        
        response = await async_client.get(f"/api/messages/conversations/{other_user_id}", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.messages
    async def test_get_messages_by_ride_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful messages retrieval by ride ID."""
        headers = await auth_headers(async_client)
        
        # This would require a ride ID, so we'll test with a non-existent ride
        ride_id = 1
        
        response = await async_client.get(f"/api/messages/ride/{ride_id}", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.messages
    async def test_mark_message_as_read_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful message read status update."""
        headers = await auth_headers(async_client)
        
        # First send a message
        current_user_response = await async_client.get("/api/users/profile", headers=headers)
        sender_id = current_user_response.json()["id"]
        receiver_id = sender_id + 1
        
        message_data = {
            "receiver_id": receiver_id,
            "content": "Test message for read status"
        }
        
        send_response = await async_client.post("/api/messages/", json=message_data, headers=headers)
        message_id = send_response.json()["id"]
        
        # Mark as read
        response = await async_client.put(f"/api/messages/{message_id}/read", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["is_read"] == True
    
    @pytest.mark.messages
    async def test_delete_message_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful message deletion."""
        headers = await auth_headers(async_client)
        
        # First send a message
        current_user_response = await async_client.get("/api/users/profile", headers=headers)
        sender_id = current_user_response.json()["id"]
        receiver_id = sender_id + 1
        
        message_data = {
            "receiver_id": receiver_id,
            "content": "Test message for deletion"
        }
        
        send_response = await async_client.post("/api/messages/", json=message_data, headers=headers)
        message_id = send_response.json()["id"]
        
        # Delete the message
        response = await async_client.delete(f"/api/messages/{message_id}", headers=headers)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
    
    @pytest.mark.messages
    async def test_get_unread_message_count_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful unread message count retrieval."""
        headers = await auth_headers(async_client)
        
        response = await async_client.get("/api/messages/unread-count", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
    
    @pytest.mark.messages
    async def test_mark_all_messages_as_read_success(self, async_client: httpx.AsyncClient, auth_headers):
        """Test successful marking all messages as read."""
        headers = await auth_headers(async_client)
        
        response = await async_client.put("/api/messages/mark-all-read", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data