from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud import create_message, get_conversation, get_user_conversations
from app.dto.message import MessageCreate, MessageResponse, ConversationResponse

router = APIRouter()


@router.post("/", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_message(db, message, current_user.id)


@router.get("/conversations", response_model=List[MessageResponse])
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
    return get_conversation(db, current_user.id, user_id)