import os
import requests
from app.db.models.car import Car
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.models.ride import Ride
from app.db.models.user import User
from app.db.models.ride_request import RideRequest
from app.db.crud.ride_request import create_ride_request
from datetime import datetime, timezone
import json
import re

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-70b-8192"

# In-memory conversation state (for demo)
conversation_state = {}

class GenAIChatRequest(BaseModel):
    message: str

class GenAIChatResponse(BaseModel):
    reply: str

@router.post("/api/genai-chat", response_model=GenAIChatResponse)
async def genai_chat(request: GenAIChatRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user.id
    user_message = request.message.strip()
    now = datetime.now(timezone.utc)

    # Step 1: Check if user is replying with a number to select a ride
    if user_id in conversation_state and isinstance(conversation_state[user_id], list):
        ride_options = conversation_state[user_id]
        try:
            idx = int(user_message.strip()) - 1  # user sends 1-based index
            if 0 <= idx < len(ride_options):
                selected_ride_id = ride_options[idx]

                # Check if already booked
                existing = db.query(RideRequest).filter_by(ride_id=selected_ride_id, rider_id=user_id).first()
                if existing:
                    reply = "You have already booked this ride."
                else:
                    create_ride_request(db, selected_ride_id, user_id, message="Booked via AI chat")
                    reply = "Your ride has been booked successfully!"

                # # Decrement seat count
                # ride = db.query(Ride).filter(Ride.id == selected_ride_id).first()
                # if ride and ride.seats_available > 0:
                #     ride.seats_available -= 1
                #     db.commit()

                # Clear state
                del conversation_state[user_id]
            else:
                reply = "Invalid ride selection number."
        except ValueError:
            reply = "Please enter a valid number corresponding to the ride option."
        return {"reply": reply}

    # Step 2: Otherwise, treat as a new booking request
    prompt = f"""
Extract the following from the user's message as JSON:
- start_location
- end_location
- time (if present)
User message: \"{user_message}\"
Return only valid JSON.
"""
    groq_payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200,
        "temperature": 0.2,
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    groq_response = requests.post(GROQ_URL, headers=headers, json=groq_payload)
    print("Groq raw response:", groq_response.status_code, groq_response.text)

    try:
        ai_content = groq_response.json()["choices"][0]["message"]["content"]
        json_match = re.search(r'\{.*\}', ai_content, re.DOTALL)
        if not json_match:
            return {"reply": f"Failed to extract JSON from: {ai_content}"}
        try:
            extracted = json.loads(json_match.group())
        except Exception as e:
            return {"reply": f"JSON parse error: {str(e)}. Raw: {json_match.group()}"}
    except Exception as e:
        print("Groq extraction error:", e)
        return {"reply": f"Groq error: {str(e)}. Response: {groq_response.text}"}

    # Validation
    start_location = extracted.get("start_location", "").strip()
    end_location = extracted.get("end_location", "").strip()

    if not start_location or not end_location:
        conversation_state[user_id] = {
            "start_location": start_location,
            "end_location": end_location,
            "time": extracted.get("time", "")
        }

        missing = []
        if not start_location:
            missing.append("starting location")
        if not end_location:
            missing.append("ending location")

        return {"reply": f"Please enter your {', and '.join(missing)} to continue booking your ride."}

    # Search future rides
    query = db.query(Ride).filter(
        Ride.start_location.ilike(f"%{start_location}%"),
        Ride.end_location.ilike(f"%{end_location}%"),
        Ride.seats_available > 0,
        Ride.start_time > now
    )

    rides = query.limit(5).all()
    if not rides:
        return {"reply": "Sorry, no rides found for your criteria."}

    # Format ride options
    options = []
    for idx, ride in enumerate(rides, 1):
        driver = db.query(User).filter(User.id == ride.driver_id).first()
        car = db.query(Car).filter(Car.id == ride.car_id).first()
        ride_time_str = ride.start_time.strftime("%I:%M %p").lstrip("0")
        options.append(
            f"{idx}. Driver: {driver.name if driver else 'Unknown'}, Contact: {driver.phone}, "
            f"Car: {car.model.upper() + car.make}, Plate: {car.license_plate}, "
            f"Time: {ride_time_str}, Fare: {ride.total_fare}"
        )

    # Save state for selection
    conversation_state[user_id] = [ride.id for ride in rides]

    # ✅ Don't use json.dumps — return raw string with real line breaks
    reply = (
        f"I found these rides from {start_location} to {end_location}:\n"
        + "\n".join(options)
        + "\nPlease click on the block of the ride you want to book."
    )

    return {"reply": reply}
