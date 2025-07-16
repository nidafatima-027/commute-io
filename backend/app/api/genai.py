from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

# Dummy Q&A pairs
DUMMY_RESPONSES: Dict[str, str] = {
    "How do I join a ride?": "To join a ride, go to the Rides tab and select a ride to join.",
    "How can I offer a ride?": "Tap on 'Offer Ride' and fill in your ride details.",
    "What is RideChat?": "RideChat is your AI assistant for all carpooling questions!",
    "How do I edit my profile?": "Go to Profile, then tap 'Edit' to update your information.",
    "How do I contact the driver?": "Use the in-app messaging feature to contact your driver.",
}

class GenAIChatRequest(BaseModel):
    message: str

class GenAIChatResponse(BaseModel):
    reply: str

@router.post("/api/genai-chat", response_model=GenAIChatResponse)
async def genai_chat(request: GenAIChatRequest):
    user_message = request.message.strip()
    # Return a dummy response if available, else a default message
    reply = DUMMY_RESPONSES.get(user_message, "I'm sorry, I don't have an answer for that yet. Please try asking something else!")
    return {"reply": reply} 