from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

service = NotificationService()


@router.get(
    "",
    response_model=list[NotificationResponse],
)
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_my_notifications(
        db,
        current_user,
    )


@router.put(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_as_read(
    notification_id,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.mark_as_read(
        db,
        notification_id,
        current_user,
    )


@router.put(
    "/read-all",
)
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.mark_all_as_read(
        db,
        current_user,
    )


@router.delete(
    "/{notification_id}",
)
def delete_notification(
    notification_id,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.delete_notification(
        db,
        notification_id,
        current_user,
    )