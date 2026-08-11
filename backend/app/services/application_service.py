import uuid

from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.enums import ApplicationStatus, WorkStatus
from app.models.user import User
from app.repositories.application_repository import ApplicationRepository
from app.repositories.work_repository import WorkRepository
from app.schemas.application import ApplicationCreate
from app.models.assignment import Assignment
from app.repositories.assignment_repository import AssignmentRepository
from app.models.enums import AssignmentStatus
from app.services.chat_service import ChatService
from app.services.notification_service import NotificationService
from app.models.enums import NotificationType
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
)

class ApplicationService:

    def __init__(self):
        self.application_repository = ApplicationRepository()
        self.work_repository = WorkRepository()
        self.assignment_repository = AssignmentRepository()
        self.chat_service = ChatService()
        self.notification_service = NotificationService()

    def apply(
        self,
        db: Session,
        current_user: User,
        application_data: ApplicationCreate,
    ) -> Application:

        work = self.work_repository.get_by_id(
            db,
            application_data.work_id,
        )

        if not work or work.is_deleted:
            raise NotFoundException("Work not found")

        if work.status != WorkStatus.OPEN:
            raise ConflictException(
    "Work is not accepting applications."
)

        if work.owner_id == current_user.id:
            raise ForbiddenException(
                "You cannot apply to your own work."
            )

        existing = self.application_repository.get_by_work_and_worker(
            db,
            application_data.work_id,
            current_user.id,
        )

        if existing:
            raise ConflictException(
                "You have already applied."
            )

        application = Application(
            work_id=application_data.work_id,
            worker_id=current_user.id,
            proposal=application_data.proposal,
            expected_budget=application_data.expected_budget,
        )

        application = self.application_repository.create(
        db,
        application,
        )

        self.notification_service.create_notification(
        db=db,
        recipient_id=work.owner_id,
        title="New Application",
        message=f"{current_user.email} applied for your work '{work.title}'.",
        notification_type=NotificationType.APPLICATION,
        )

        return application

    def get_my_applications(
        self,
        db: Session,
        current_user: User,
    ):

        return self.application_repository.get_by_worker(
            db,
            current_user.id,
        )

    def get_work_applications(
        self,
        db: Session,
        work_id: uuid.UUID,
        current_user: User,
    ):

        work = self.work_repository.get_by_id(
            db,
            work_id,
        )

        if not work:
            raise NotFoundException("Work not found")

        if work.owner_id != current_user.id:
            raise ForbiddenException(
                "Only the work owner can view applications."
            )

        return self.application_repository.get_by_work(
            db,
            work_id,
        )
    

    def accept_application(
    self,
    db: Session,
    application_id: uuid.UUID,
    current_user: User,
):

        application = self.application_repository.get_by_id(
        db,
        application_id,
        )

        if not application:
            raise NotFoundException("Application not found")

        work = self.work_repository.get_by_id(
        db,
        application.work_id,
        )

        if not work:
            raise NotFoundException("Work not found")

        if work.owner_id != current_user.id:
            raise ForbiddenException(
            "Only the work owner can accept applications."
        )

        if application.status != ApplicationStatus.PENDING:
            raise ConflictException(
        "Only pending applications can be accepted."
    )

        application.status = ApplicationStatus.ACCEPTED

        self.application_repository.update(
        db,
        application,
        )

        self.application_repository.reject_other_applications(
        db,
        work.id,
        application.id,
        )

        work.status = WorkStatus.IN_PROGRESS

        self.work_repository.update(
        db,
        work,
        )

        assignment = Assignment(
        work_id=work.id,
        client_id=work.owner_id,
        worker_id=application.worker_id,
        accepted_budget=application.expected_budget,
        status=AssignmentStatus.ACTIVE,
        )

        assignment = self.assignment_repository.create(
        db,
        assignment,
        )

        self.chat_service.create_chat_for_assignment(
        db,
        assignment.id,
        )

        self.notification_service.create_notification(
        db=db,
        recipient_id=application.worker_id,
        title="Application Accepted",
        message=f"Your application for '{work.title}' has been accepted.",
        notification_type=NotificationType.ASSIGNMENT,
        )

        return assignment
    
    def reject_application(
    self,
    db: Session,
    application_id: uuid.UUID,
    current_user: User,
    ):

        application = self.application_repository.get_by_id(
        db,
        application_id,
        )

        if not application:
            raise NotFoundException("Application not found")

        work = self.work_repository.get_by_id(
        db,
        application.work_id,
        )

        if not work:
            raise NotFoundException("Work not found")

        if work.owner_id != current_user.id:
            raise ForbiddenException(
            "Only the work owner can reject applications."
        )

        if application.status != ApplicationStatus.PENDING:
            raise ConflictException(
        "Only pending applications can be rejected."
    )

        application.status = ApplicationStatus.REJECTED

        application = self.application_repository.update(
        db,
        application,
        )

        self.notification_service.create_notification(
        db=db,
        recipient_id=application.worker_id,
        title="Application Rejected",
        message=f"Your application for '{work.title}' was rejected.",
        notification_type=NotificationType.APPLICATION,
        )

        return application
    
    def withdraw_application(
    self,
    db: Session,
    application_id: uuid.UUID,
    current_user: User,
    ):

        application = self.application_repository.get_by_id(
        db,
        application_id,
        )

        if not application:
            raise NotFoundException("Application not found")

        if application.worker_id != current_user.id:
            raise ForbiddenException(
            "You can only withdraw your own application."
        )

        if application.status != ApplicationStatus.PENDING:
            raise ConflictException(
            "Only pending applications can be withdrawn."
        )

        application.status = ApplicationStatus.WITHDRAWN

        return self.application_repository.update(
        db,
        application,
        )