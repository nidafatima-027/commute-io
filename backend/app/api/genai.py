import openai
import os
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

class GenAIChatRequest(BaseModel):
    message: str

class GenAIChatResponse(BaseModel):
    reply: str

@router.post("/api/genai-chat", response_model=GenAIChatResponse)
async def genai_chat(request: GenAIChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful carpool assistant. Answer user questions about rides, booking, and the app."},
                {"role": "user", "content": request.message}
            ],
            max_tokens=200,
            temperature=0.7,
        )
        reply = response.choices[0].message['content'].strip()
    except Exception as e:
        reply = "Sorry, I couldn't process your request right now."
    return {"reply": reply} 