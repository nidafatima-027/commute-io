from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Time
from sqlalchemy.relationship import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    photo_url = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    role_mode = Column(String, nullable=False, default="rider")  # rider, driver, both
    trust_score = Column(Float, default=0.0)
    preferences = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    cars = relationship("Car", back_populates="user")
    driver_rides = relationship("Ride", foreign_keys="Ride.driver_id", back_populates="driver")
    ride_requests = relationship("RideRequest", back_populates="rider")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    preferred_locations = relationship("PreferredLocation", back_populates="user")
    schedules = relationship("Schedule", back_populates="user")
    ride_history = relationship("RideHistory", back_populates="user")


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=True)
    color = Column(String, nullable=True)
    license_plate = Column(String, nullable=False)
    seats = Column(Integer, nullable=False)
    photo_url = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="cars")
    rides = relationship("Ride", back_populates="car")


class PreferredLocation(Base):
    __tablename__ = "preferred_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Home", "Office"
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationships
    user = relationship("User", back_populates="preferred_locations")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    # Relationships
    user = relationship("User", back_populates="schedules")


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    start_location_id = Column(Integer, nullable=False)  # Reference to location
    end_location_id = Column(Integer, nullable=False)    # Reference to location
    start_time = Column(DateTime, nullable=False)
    seats_available = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="active")  # active, completed, cancelled

    # Relationships
    driver = relationship("User", foreign_keys=[driver_id], back_populates="driver_rides")
    car = relationship("Car", back_populates="rides")
    ride_requests = relationship("RideRequest", back_populates="ride")
    messages = relationship("Message", back_populates="ride")


class RideRequest(Base):
    __tablename__ = "ride_requests"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending, accepted, rejected
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    message = Column(Text, nullable=True)

    # Relationships
    rider = relationship("User", back_populates="ride_requests")
    ride = relationship("Ride", back_populates="ride_requests")


class RideHistory(Base):
    __tablename__ = "ride_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=False)
    role = Column(String, nullable=False)  # driver, rider
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    rating_given = Column(Integer, nullable=True)  # 1-5 stars
    rating_received = Column(Integer, nullable=True)  # 1-5 stars

    # Relationships
    user = relationship("User", back_populates="ride_history")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=True)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")
    ride = relationship("Ride", back_populates="messages")