from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

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