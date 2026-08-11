from datetime import datetime, timezone
import uuid

from sqlalchemy.orm import Session

from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
)
from app.models.assignment import Assignment
from app.models.enums import (
    AssignmentStatus,
    NotificationType,
)
from app.models.user import User
from app.repositories.assignment_repository import (
    AssignmentRepository,
)
from app.services.notification_service import (
    NotificationService,
)


class AssignmentService:

    def __init__(self):
        self.repository = AssignmentRepository()
        self.notification_service = NotificationService()

    def get_assignment(
        self,
        db: Session,
        assignment_id: uuid.UUID,
    ) -> Assignment:

        assignment = self.repository.get_by_id(
            db,
            assignment_id,
        )

        if not assignment or assignment.is_deleted:
            raise NotFoundException(
                "Assignment not found."
            )

        return assignment

    def get_my_assignments(
        self,
        db: Session,
        current_user: User,
    ) -> list[Assignment]:

        worker_assignments = (
            self.repository.get_by_worker(
                db,
                current_user.id,
            )
        )

        client_assignments = (
            self.repository.get_by_client(
                db,
                current_user.id,
            )
        )

        assignment_map = {
            assignment.id: assignment
            for assignment in (
                worker_assignments
                + client_assignments
            )
        }

        return list(
            assignment_map.values()
        )

    def complete_assignment(
        self,
        db: Session,
        assignment_id: uuid.UUID,
        current_user: User,
    ) -> Assignment:

        assignment = self.get_assignment(
            db,
            assignment_id,
        )

        if current_user.id not in (
            assignment.client_id,
            assignment.worker_id,
        ):
            raise ForbiddenException(
                "You are not part of this assignment."
            )
        
        if assignment.status != AssignmentStatus.ACTIVE:
            raise ConflictException(
        "Only active assignments can be completed."
        )

        assignment.completed_at = datetime.now(
            timezone.utc,
        )

        assignment.status = (
            AssignmentStatus.COMPLETED
        )

        assignment = self.repository.update(
            db,
            assignment,
        )

        recipient_id = (
            assignment.worker_id
            if current_user.id
            == assignment.client_id
            else assignment.client_id
        )

        self.notification_service.create_notification(
            db=db,
            recipient_id=recipient_id,
            title="Assignment Completed",
            message=(
                "The assignment has been marked "
                "as completed."
            ),
            notification_type=(
                NotificationType.ASSIGNMENT
            ),
        )

        return assignment

    def cancel_assignment(
        self,
        db: Session,
        assignment_id: uuid.UUID,
        current_user: User,
    ) -> Assignment:

        assignment = self.get_assignment(
            db,
            assignment_id,
        )

        if current_user.id not in (
            assignment.client_id,
            assignment.worker_id,
        ):
            raise ForbiddenException(
                "You are not part of this assignment."
            )
        
        if assignment.status != AssignmentStatus.ACTIVE:
            raise ConflictException(
        "Only active assignments can be cancelled."
    )

        assignment.status = (
            AssignmentStatus.CANCELLED
        )

        assignment = self.repository.update(
            db,
            assignment,
        )

        recipient_id = (
            assignment.worker_id
            if current_user.id
            == assignment.client_id
            else assignment.client_id
        )

        self.notification_service.create_notification(
            db=db,
            recipient_id=recipient_id,
            title="Assignment Cancelled",
            message=(
                "The assignment has been cancelled."
            ),
            notification_type=(
                NotificationType.ASSIGNMENT
            ),
        )

        return assignment