from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.conversation import ConversationResponse
from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)

service = ChatService()


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def get_my_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_my_chats(
        db,
        str(current_user.id),
    )


@router.get(
    "/{assignment_id}",
    response_model=ConversationResponse,
)
def get_chat(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_chat(
        db,
        assignment_id,
        str(current_user.id),
    )