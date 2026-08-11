from sqlalchemy.orm import Session

from app.models.message import Message


class MessageRepository:

    def create(
        self,
        db: Session,
        message: Message,
    ) -> Message:

        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    def get_by_id(
        self,
        db: Session,
        message_id,
    ) -> Message | None:

        return (
            db.query(Message)
            .filter(
                Message.id == message_id,
                Message.is_deleted == False,
            )
            .first()
        )

    def get_by_conversation(
        self,
        db: Session,
        conversation_id,
    ) -> list[Message]:

        return (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation_id,
                Message.is_deleted == False,
            )
            .order_by(
                Message.created_at.asc(),
            )
            .all()
        )

    def update(
        self,
        db: Session,
        message: Message,
    ) -> Message:

        db.commit()
        db.refresh(message)

        return message

    def delete(
        self,
        db: Session,
        message: Message,
    ) -> None:

        message.is_deleted = True

        db.commit()