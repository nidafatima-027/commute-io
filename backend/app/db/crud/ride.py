from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime, date
from app.db.models.ride import Ride
from app.db.models.ride_history import RideHistory
from app.schema.ride import RideCreate, RideUpdate
import pytz, requests, json, re, ast, os
from sqlalchemy import func

def get_available_rides(db: Session, user_id: int, limit: int = 50) -> List[Ride]:
    # Get current Pakistan time
    pakistan_tz = pytz.timezone('Asia/Karachi')
    now_pakistan = datetime.now(pakistan_tz).replace(tzinfo=None)
    
    print(f"Current Pakistan Time: {now_pakistan}")
    
    rides = db.query(Ride).options(
        joinedload(Ride.driver),
        joinedload(Ride.car)
    ).filter(
        Ride.driver_id != user_id,
        Ride.status == "active",
        Ride.seats_available > 0,
        Ride.start_time > now_pakistan
    ).limit(limit).all()

    for ride in rides:
        driver = ride.driver
        rides_offered = db.query(Ride).filter(Ride.driver_id == driver.id).count()
        driver.driver_rating = round(db.query(
            func.avg(func.coalesce(RideHistory.rating_given, 5))
        ).join(
            Ride, RideHistory.ride_id == Ride.id
        ).filter(
            Ride.driver_id == driver.id
        ).scalar() or 0, 1) if rides_offered > 0 else 0

        driver.ride_offered =  db.query(Ride).filter(
            Ride.driver_id == driver.id
        ).count()
    
    return rides

def get_user_rides(db: Session, user_id: int) -> List[Ride]:
    today = date.today()
    return (
        db.query(Ride)
        .filter(
            Ride.driver_id == user_id,
            Ride.status == 'active',  # adjust to your active flag
            Ride.start_time >= datetime.combine(today, datetime.min.time()),
            Ride.start_time <= datetime.combine(today, datetime.max.time())
        )
        .all()
    )

def get_user_completed_rides(db: Session, user_id: int) -> List[Ride]:
    today = date.today()
    return (
        db.query(Ride)
        .filter(
            Ride.driver_id == user_id,
            Ride.status == 'end',  # adjust to your active flag
        )
        .all()
    )

def create_ride(db: Session, ride: RideCreate, driver_id: int) -> Ride:
    main_stops = extract_main_stops(ride.start_location, ride.end_location)
    
    # Add start and end locations to the stops list
    if main_stops:
        # Create complete route: start -> intermediate stops -> end
        complete_stops = [ride.start_location] + main_stops + [ride.end_location]
    else:
        # If no intermediate stops, just start and end
        complete_stops = [ride.start_location, ride.end_location]
    
    print(f"Complete route stops: {complete_stops}")
    db_ride = Ride(
        **ride.dict(exclude={"main_stops"}),
        driver_id=driver_id,
        main_stops=complete_stops
    )
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride

def get_ride(db: Session, ride_id: int) -> Optional[Ride]:
    ride =  db.query(Ride).filter(Ride.id == ride_id).first()

    driver = ride.driver
    rides_offered = db.query(Ride).filter(Ride.driver_id == driver.id).count()
    driver.driver_rating = round(db.query(
        func.avg(func.coalesce(RideHistory.rating_given, 5))
    ).join(
        Ride, RideHistory.ride_id == Ride.id
    ).filter(
        Ride.driver_id == driver.id
    ).scalar() or 0, 1) if rides_offered > 0 else 0

    driver.ride_offered =  db.query(Ride).filter(
        Ride.driver_id == driver.id
    ).count()

    return ride

def update_ride(db: Session, ride_id: int, ride_update: RideUpdate, driver_id: int) -> Optional[Ride]:
    db_ride = db.query(Ride).filter(Ride.id == ride_id, Ride.driver_id == driver_id).first()
    if not db_ride:
        return None
    for field, value in ride_update.dict(exclude_unset=True).items():
        setattr(db_ride, field, value)
    db.commit()
    db.refresh(db_ride)
    return db_ride

    
def extract_main_stops(start_location: str, end_location: str) -> list:
    prompt = f"""
    You are a route planner for Karachi, Pakistan.
    
    Task: List the main stops/landmarks between "{start_location}" and "{end_location}" in Karachi.
    
    Instructions:
    - Return ONLY a Python list format
    - Include 3-6 main stops/landmarks along the route
    - Do not include any explanation or additional text
    - Format: ["Stop1", "Stop2", "Stop3"]
    
    Route: {start_location} to {end_location}
    
    Response:"""

    groq_payload = {
        "model": "llama3-70b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200,
        "temperature": 0.1,
    }

    headers = {
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=groq_payload)
        content = response.json()["choices"][0]["message"]["content"]
        print("Full Groq Content:", content)  # Debug line
        
        # Extract the list from the content using regex
        list_pattern = r'\[.*?\]'
        match = re.search(list_pattern, content, re.DOTALL)
        
        if match:
            list_str = match.group(0)
            print("Extracted list string:", list_str)  # Debug line
            stops_list = ast.literal_eval(list_str)
            if isinstance(stops_list, list):
                return stops_list
        
        print("No valid list found in response")
        return []
    except Exception as e:
        print("Error extracting stops:", e)
        return []