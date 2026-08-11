import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.message import (
    MessageCreate,
    MessageResponse,
)
from app.services.message_service import MessageService


router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)

service = MessageService()


@router.post(
    "/{assignment_id}",
    response_model=MessageResponse,
)
def send_message(
    assignment_id: uuid.UUID,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.send_message(
        db=db,
        assignment_id=assignment_id,
        current_user=current_user,
        message_data=message_data,
    )


@router.get(
    "/{assignment_id}",
    response_model=list[MessageResponse],
)
def get_messages(
    assignment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_messages(
        db=db,
        assignment_id=assignment_id,
        current_user=current_user,
    )


@router.delete(
    "/{message_id}",
)
def delete_message(
    message_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.delete_message(
        db=db,
        message_id=message_id,
        current_user=current_user,
    )