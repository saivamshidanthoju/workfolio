from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    def create(
        self,
        db: Session,
        notification: Notification,
    ) -> Notification:

        db.add(notification)
        db.commit()
        db.refresh(notification)

        return notification

    def get_by_id(
        self,
        db: Session,
        notification_id,
    ) -> Notification | None:

        return (
            db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.is_deleted == False,
            )
            .first()
        )

    def get_by_recipient(
        self,
        db: Session,
        recipient_id,
    ) -> list[Notification]:

        return (
            db.query(Notification)
            .filter(
                Notification.recipient_id == recipient_id,
                Notification.is_deleted == False,
            )
            .order_by(
                Notification.created_at.desc(),
            )
            .all()
        )

    def update(
        self,
        db: Session,
        notification: Notification,
    ) -> Notification:

        db.commit()
        db.refresh(notification)

        return notification

    def mark_all_as_read(
        self,
        db: Session,
        recipient_id,
    ):

        notifications = (
            db.query(Notification)
            .filter(
                Notification.recipient_id == recipient_id,
                Notification.is_read == False,
                Notification.is_deleted == False,
            )
            .all()
        )

        for notification in notifications:
            notification.is_read = True

        db.commit()

    def delete(
        self,
        db: Session,
        notification: Notification,
    ):

        notification.is_deleted = True

        db.commit()