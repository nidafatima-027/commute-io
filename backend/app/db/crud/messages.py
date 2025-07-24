from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func, distinct
from typing import List, Dict
from app.db.models.message import Message
from app.db.models.user import User
from app.schema.message import MessageCreate

def create_message(db: Session, message: MessageCreate, sender_id: int) -> Message:
    db_message = Message(**message.dict(), sender_id=sender_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_conversation(db: Session, user1_id: int, user2_id: int) -> List[Message]:
    return db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.sent_at).all()

def get_user_conversations(db: Session, user_id: int) -> List[Dict]:
    """Get list of conversations with last message and user details"""
    # Subquery to get the latest message for each conversation
    latest_messages = db.query(
        func.max(Message.id).label('latest_id')
    ).filter(
        or_(Message.sender_id == user_id, Message.receiver_id == user_id)
    ).group_by(
        func.case(
            (Message.sender_id == user_id, Message.receiver_id),
            else_=Message.sender_id
        )
    ).subquery()
    
    # Get the actual latest messages with user details
    conversations = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(
        Message.id.in_(latest_messages.c.latest_id)
    ).order_by(Message.sent_at.desc()).all()
    
    # Format the response
    result = []
    for msg in conversations:
        other_user = msg.receiver if msg.sender_id == user_id else msg.sender
        result.append({
            'user_id': other_user.id,
            'user_name': other_user.name,
            'user_photo': other_user.photo_url,
            'last_message': msg.content,
            'last_message_time': msg.sent_at,
            'last_message_id': msg.id,
            'ride_id': msg.ride_id
        })
    
    return result