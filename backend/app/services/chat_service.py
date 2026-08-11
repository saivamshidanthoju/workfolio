from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, NotFoundException
from app.core.logger import logger
from app.models.conversation import Conversation
from app.repositories.assignment_repository import AssignmentRepository
from app.repositories.conversation_repository import ConversationRepository


class ChatService:

    def __init__(self):
        self.conversation_repository = ConversationRepository()
        self.assignment_repository = AssignmentRepository()

    def get_chat(
        self,
        db: Session,
        assignment_id: str,
        user_id: str,
    ) -> Conversation:

        assignment = self.assignment_repository.get_by_id(
            db,
            assignment_id,
        )

        if not assignment:
            raise NotFoundException(
                "Assignment not found."
            )

        # Only assignment participants can access the chat
        if (
    str(assignment.client_id) != user_id
    and str(assignment.worker_id) != user_id
    ):
            raise ForbiddenException(
        "You are not allowed to access this chat."
        )

        conversation = (
            self.conversation_repository.get_by_assignment(
                db,
                assignment_id,
            )
        )

        if not conversation:
            conversation = (
                self.conversation_repository.create(
                    db,
                    assignment_id,
                )
            )

            logger.info(
                "Chat created for assignment %s",
                assignment_id,
            )

        return conversation

    def get_my_chats(
        self,
        db: Session,
        user_id: str,
    ):

        return self.conversation_repository.get_my_conversations(
            db,
            user_id,
        )
    
    def create_chat_for_assignment(
    self,
    db: Session,
    assignment_id,
    ) -> Conversation:

        conversation = (
        self.conversation_repository.get_by_assignment(
            db,
            assignment_id,
            )
        )

        if conversation:
            return conversation

        conversation = (
        self.conversation_repository.create(
            db,
            assignment_id,
            )
        )

        logger.info(
        "Chat created for assignment %s",
        assignment_id,
        )

        return conversation