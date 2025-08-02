from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class RideRequest(Base):
    __tablename__ = "ride_requests"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending, accepted, rejected
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    message = Column(Text, nullable=True)
    joining_stop = Column(String(255), nullable=False)  # New field
    ending_stop = Column(String(255), nullable=False)   # New field

    # Relationships
    rider = relationship("User", back_populates="ride_requests")
    ride = relationship("Ride", back_populates="ride_requests")