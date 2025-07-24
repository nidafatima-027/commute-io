import sqlite3
from datetime import datetime, timedelta
import random
import json

def create_dummy_data():
    # Connect to database
    conn = sqlite3.connect('commute_io.db')
    cursor = conn.cursor()
    
    # Sample data
    users_data = [
        (1, "John Doe", "john.doe@email.com", "+1234567890", "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", "Love driving and meeting new people!", True, True, 4.8, '{"music": "pop", "talking": "minimal"}'),
        (2, "Sarah Johnson", "sarah.j@email.com", "+1234567891", "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", "Eco-friendly commuter", True, True, 4.9, '{"music": "jazz", "talking": "friendly"}'),
        (3, "Mike Chen", "mike.chen@email.com", "+1234567892", "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg", "Student at university", False, True, 4.7, '{"music": "any", "talking": "chatty"}'),
        (4, "Emily Davis", "emily.d@email.com", "+1234567893", "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg", "Marketing professional", True, False, 4.6, '{"music": "rock", "talking": "quiet"}'),
        (5, "Alex Rivera", "alex.r@email.com", "+1234567894", "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg", "Tech worker, flexible schedule", True, True, 4.5, '{"music": "electronic", "talking": "moderate"}'),
        (6, "Lisa Wang", "lisa.w@email.com", "+1234567895", "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg", "Healthcare worker", False, True, 4.8, '{"music": "classical", "talking": "friendly"}'),
        (7, "David Brown", "david.b@email.com", "+1234567896", "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg", "Finance professional", True, False, 4.7, '{"music": "country", "talking": "minimal"}'),
        (8, "Anna Garcia", "anna.g@email.com", "+1234567897", "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg", "Teacher, regular commuter", False, True, 4.9, '{"music": "indie", "talking": "chatty"}')
    ]
    
    cars_data = [
        (1, 1, "Toyota", "Camry", 2020, "Silver", "ABC123", 4, "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg"),
        (2, 2, "Honda", "Civic", 2019, "Blue", "DEF456", 4, "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg"),
        (3, 4, "Tesla", "Model 3", 2021, "White", "GHI789", 4, "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg"),
        (4, 5, "Ford", "Escape", 2018, "Red", "JKL012", 5, "https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg"),
        (5, 7, "BMW", "X3", 2022, "Black", "MNO345", 5, "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg")
    ]
    
    locations_data = [
        (1, 1, "Home", "123 Main St, City Center", 40.7128, -74.0060),
        (2, 1, "Work", "456 Business Ave, Downtown", 40.7589, -73.9851),
        (3, 2, "Home", "789 Oak Street, Suburbs", 40.6892, -74.0445),
        (4, 2, "Office", "321 Corporate Blvd, Business District", 40.7505, -73.9934),
        (5, 3, "University", "College Campus, Student Quarter", 40.7282, -73.9942),
        (6, 3, "Apartment", "567 Student Housing, Near Campus", 40.7249, -73.9916),
        (7, 4, "Home", "890 Residential Dr, Uptown", 40.7831, -73.9712),
        (8, 4, "Marketing Office", "654 Creative St, Midtown", 40.7549, -73.9840),
        (9, 5, "Home", "432 Tech Valley, Innovation District", 40.7390, -74.0026),
        (10, 5, "Tech Campus", "876 Silicon Ave, Tech Hub", 40.7614, -73.9776),
        (11, 6, "Home", "246 Healthcare Dr, Medical District", 40.7143, -74.0060),
        (12, 6, "Hospital", "135 Medical Center, Healthcare Zone", 40.7755, -73.9537),
        (13, 7, "Home", "975 Finance St, Financial Quarter", 40.7074, -74.0113),
        (14, 7, "Bank", "531 Wall Street, Financial District", 40.7074, -74.0113),
        (15, 8, "Home", "864 Teacher Ave, Education District", 40.6823, -73.9654),
        (16, 8, "School", "297 Learning Blvd, Academic Zone", 40.7282, -73.9571)
    ]
    
    # Generate ride data (some completed, some upcoming)
    now = datetime.now()
    rides_data = []
    ride_id = 1
    
    # Past rides (completed)
    for i in range(15):
        days_ago = random.randint(1, 90)
        start_time = now - timedelta(days=days_ago, hours=random.randint(6, 22))
        driver_id = random.choice([1, 2, 4, 5, 7])  # Only drivers
        car_id = {1: 1, 2: 2, 4: 3, 5: 4, 7: 5}[driver_id]
        start_loc = random.randint(1, 16)
        end_loc = random.randint(1, 16)
        while end_loc == start_loc:
            end_loc = random.randint(1, 16)
        
        rides_data.append((ride_id, driver_id, car_id, start_loc, end_loc, start_time.isoformat(), random.randint(1, 3), "completed"))
        ride_id += 1
    
    # Future rides (upcoming)
    for i in range(5):
        days_ahead = random.randint(1, 30)
        start_time = now + timedelta(days=days_ahead, hours=random.randint(6, 22))
        driver_id = random.choice([1, 2, 4, 5, 7])  # Only drivers
        car_id = {1: 1, 2: 2, 4: 3, 5: 4, 7: 5}[driver_id]
        start_loc = random.randint(1, 16)
        end_loc = random.randint(1, 16)
        while end_loc == start_loc:
            end_loc = random.randint(1, 16)
        
        rides_data.append((ride_id, driver_id, car_id, start_loc, end_loc, start_time.isoformat(), random.randint(1, 4), "active"))
        ride_id += 1
    
    # Generate ride history data for completed rides
    ride_history_data = []
    history_id = 1
    
    # For each completed ride, create history entries
    completed_rides = [ride for ride in rides_data if ride[7] == "completed"]
    
    for ride in completed_rides:
        ride_id, driver_id = ride[0], ride[1]
        ride_start_time = datetime.fromisoformat(ride[5])
        completed_time = ride_start_time + timedelta(hours=random.randint(1, 3))
        
        # Driver history entry
        driver_rating = random.randint(4, 5)
        rider_rating = random.randint(3, 5)
        ride_history_data.append((
            history_id, driver_id, ride_id, "driver", 
            ride_start_time.isoformat(), completed_time.isoformat(),
            driver_rating, rider_rating
        ))
        history_id += 1
        
        # Add 1-3 riders for each completed ride
        num_riders = random.randint(1, min(3, ride[6]))  # Don't exceed available seats
        rider_ids = random.sample([user[0] for user in users_data if user[0] != driver_id and user[8]], num_riders)
        
        for rider_id in rider_ids:
            joined_time = ride_start_time - timedelta(minutes=random.randint(5, 60))
            rider_rating = random.randint(3, 5)
            driver_rating = random.randint(4, 5)
            ride_history_data.append((
                history_id, rider_id, ride_id, "rider",
                joined_time.isoformat(), completed_time.isoformat(),
                rider_rating, driver_rating
            ))
            history_id += 1
    
    try:
        # Insert users
        cursor.executemany("""
            INSERT OR REPLACE INTO users (id, name, email, phone, photo_url, bio, is_driver, is_rider, trust_score, preferences)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, users_data)
        
        # Insert cars
        cursor.executemany("""
            INSERT OR REPLACE INTO cars (id, user_id, make, model, year, color, license_plate, seats, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, cars_data)
        
        # Insert preferred locations
        cursor.executemany("""
            INSERT OR REPLACE INTO preferred_locations (id, user_id, name, address, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)
        """, locations_data)
        
        # Insert rides
        cursor.executemany("""
            INSERT OR REPLACE INTO rides (id, driver_id, car_id, start_location_id, end_location_id, start_time, seats_available, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, rides_data)
        
        # Insert ride history
        cursor.executemany("""
            INSERT OR REPLACE INTO ride_history (id, user_id, ride_id, role, joined_at, completed_at, rating_given, rating_received)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ride_history_data)
        
        conn.commit()
        
        # Print summary
        cursor.execute("SELECT COUNT(*) FROM users")
        users_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM cars")
        cars_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM preferred_locations")
        locations_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM rides")
        rides_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM ride_history")
        history_count = cursor.fetchone()[0]
        
        print(f"Successfully created dummy data:")
        print(f"- Users: {users_count}")
        print(f"- Cars: {cars_count}")
        print(f"- Locations: {locations_count}")
        print(f"- Rides: {rides_count}")
        print(f"- Ride History: {history_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_dummy_data()