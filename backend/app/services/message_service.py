from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.message import Message
from app.models.user import User
from app.repositories.message_repository import MessageRepository
from app.services.chat_service import ChatService
from app.schemas.message import MessageCreate
from app.models.enums import NotificationType
from app.services.notification_service import NotificationService
from app.repositories.assignment_repository import AssignmentRepository
from app.repositories.user_repository import UserRepository


class MessageService:

    def __init__(self):
        self.message_repository = MessageRepository()
        self.chat_service = ChatService()
        self.notification_service = NotificationService()
        self.assignment_repository = AssignmentRepository()
        self.user_repository = UserRepository()

    def send_message(
        self,
        db: Session,
        assignment_id,
        current_user: User,
        message_data: MessageCreate,
    ) -> Message:

        conversation = self.chat_service.get_chat(
            db=db,
            assignment_id=assignment_id,
            user_id=str(current_user.id),
        )

        message = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        message=message_data.message,
        attachment=message_data.attachment,
        )

        message = self.message_repository.create(
        db,
        message,
        )

        assignment = self.assignment_repository.get_by_id(
        db,
        assignment_id,
        )

        recipient_id = (
        assignment.worker_id
        if assignment.client_id == current_user.id
        else assignment.client_id
        )

        self.notification_service.create_notification(
        db=db,
        recipient_id=recipient_id,
        title="New Message",
        message=f"{current_user.email} sent you a message.",
        notification_type=NotificationType.MESSAGE,
        )

        return message

    def get_messages(
        self,
        db: Session,
        assignment_id,
        current_user: User,
    ):

        conversation = self.chat_service.get_chat(
            db=db,
            assignment_id=assignment_id,
            user_id=str(current_user.id),
        )

        return self.message_repository.get_by_conversation(
            db,
            conversation.id,
        )

    def delete_message(
        self,
        db: Session,
        message_id,
        current_user: User,
    ):

        message = self.message_repository.get_by_id(
            db,
            message_id,
        )

        if not message:
            raise NotFoundException(
                "Message not found."
            )

        if str(message.sender_id) != str(current_user.id):
            raise ForbiddenException(
                "You can only delete your own messages."
            )

        self.message_repository.delete(
            db,
            message,
        )

        return {
            "message": "Message deleted successfully."
        }