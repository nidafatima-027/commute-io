from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List
from app.db.models import Message
from app.schema.message import MessageCreate

def create_message(db: Session, message: MessageCreate, sender_id: int) -> Message:
    db_message = Message(**message.dict(), sender_id=sender_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_conversation(db: Session, user1_id: int, user2_id: int) -> List[Message]:
    return db.query(Message).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.sent_at).all()

def get_user_conversations(db: Session, user_id: int) -> List[Message]:
    return db.query(Message).filter(
        or_(Message.sender_id == user_id, Message.receiver_id == user_id)
    ).order_by(Message.sent_at.desc()).all()
