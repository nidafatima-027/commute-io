from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.models.user import User

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud.messages import create_message, get_conversation, get_user_conversations
from app.schema.message import MessageCreate, MessageResponse, ConversationResponse

router = APIRouter()


@router.post("/", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_message(db, message, current_user.id)


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_conversations(db, current_user.id)


@router.get("/{user_id}", response_model=List[MessageResponse])
async def get_conversation_with_user(
    user_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Optionally, you might want to prevent users from checking their own messages
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot get conversation with yourself"
        )
    return get_conversation(db, current_user.id, user_id)