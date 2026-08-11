from sqlalchemy.orm import Session

from app.core.exceptions import (
    ForbiddenException,
    NotFoundException,
)
from app.models.notification import Notification
from app.models.user import User
from app.repositories.notification_repository import (
    NotificationRepository,
)


class NotificationService:

    def __init__(self):
        self.notification_repository = (
            NotificationRepository()
        )

    def create_notification(
        self,
        db: Session,
        recipient_id,
        title: str,
        message: str,
        notification_type,
    ) -> Notification:

        notification = Notification(
            recipient_id=recipient_id,
            title=title,
            message=message,
            type=notification_type,
        )

        return self.notification_repository.create(
            db,
            notification,
        )

    def get_my_notifications(
        self,
        db: Session,
        current_user: User,
    ):

        return self.notification_repository.get_by_recipient(
            db,
            current_user.id,
        )

    def mark_as_read(
        self,
        db: Session,
        notification_id,
        current_user: User,
    ):

        notification = (
            self.notification_repository.get_by_id(
                db,
                notification_id,
            )
        )

        if not notification:
            raise NotFoundException(
                "Notification not found."
            )

        if notification.recipient_id != current_user.id:
            raise ForbiddenException(
                "You cannot modify this notification."
            )

        notification.is_read = True

        return self.notification_repository.update(
            db,
            notification,
        )

    def mark_all_as_read(
        self,
        db: Session,
        current_user: User,
    ):

        self.notification_repository.mark_all_as_read(
            db,
            current_user.id,
        )

        return {
            "message": "All notifications marked as read."
        }

    def delete_notification(
        self,
        db: Session,
        notification_id,
        current_user: User,
    ):

        notification = (
            self.notification_repository.get_by_id(
                db,
                notification_id,
            )
        )

        if not notification:
            raise NotFoundException(
                "Notification not found."
            )

        if notification.recipient_id != current_user.id:
            raise ForbiddenException(
                "You cannot delete this notification."
            )

        self.notification_repository.delete(
            db,
            notification,
        )

        return {
            "message": "Notification deleted successfully."
        }