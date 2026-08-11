from sqlalchemy.orm import Session, joinedload

from app.models.conversation import Conversation
from app.models.assignment import Assignment


class ConversationRepository:

    def create(
        self,
        db: Session,
        assignment_id: str,
    ) -> Conversation:

        conversation = Conversation(
            assignment_id=assignment_id,
        )

        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return conversation

    def get_by_id(
        self,
        db: Session,
        conversation_id: str,
    ) -> Conversation | None:

        return (
            db.query(Conversation)
            .options(
                joinedload(Conversation.assignment)
            )
            .filter(
                Conversation.id == conversation_id,
                Conversation.is_deleted == False,
            )
            .first()
        )

    def get_by_assignment(
        self,
        db: Session,
        assignment_id: str,
    ) -> Conversation | None:

        return (
            db.query(Conversation)
            .filter(
                Conversation.assignment_id == assignment_id,
                Conversation.is_deleted == False,
            )
            .first()
        )

    def get_my_conversations(
        self,
        db: Session,
        user_id: str,
    ) -> list[Conversation]:

        return (
            db.query(Conversation)
            .join(Assignment)
            .filter(
                Conversation.is_deleted == False,
                (
                    (Assignment.client_id == user_id)
                    | (Assignment.worker_id == user_id)
                ),
            )
            .options(
                joinedload(Conversation.assignment)
            )
            .order_by(
                Conversation.created_at.desc(),
            )
            .all()
        )