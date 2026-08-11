from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.application_repository import (
    ApplicationRepository,
)
from app.repositories.assignment_repository import (
    AssignmentRepository,
)
from app.repositories.notification_repository import (
    NotificationRepository,
)
from app.repositories.profile_repository import (
    ProfileRepository,
)
from app.repositories.work_repository import (
    WorkRepository,
)
from app.repositories.worker_profile_repository import (
    WorkerProfileRepository,
)
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStats,
)

class DashboardService:

    def __init__(self):

        self.profile_repository = ProfileRepository()

        self.worker_profile_repository = (
            WorkerProfileRepository()
        )

        self.work_repository = WorkRepository()

        self.application_repository = (
            ApplicationRepository()
        )

        self.assignment_repository = (
            AssignmentRepository()
        )

        self.notification_repository = (
            NotificationRepository()
        )

    def get_dashboard(
    self,
    db: Session,
    current_user: User,
    ) -> DashboardResponse:

        profile = self.profile_repository.get_by_user_id(
        db,
        current_user.id,
        )

        worker_profile = (
        self.worker_profile_repository.get_by_user_id(
            db,
            current_user.id,
            )
        )

        my_works = self.work_repository.get_by_owner(
        db,
        current_user.id,
        )

        my_applications = (
        self.application_repository.get_by_worker(
            db,
            current_user.id,
        )
        )

        my_assignments = (
        self.assignment_repository.get_by_worker(
            db,
            current_user.id,
        )
        +
        self.assignment_repository.get_by_client(
            db,
            current_user.id,
        )
        )

        notifications = (
        self.notification_repository.get_by_recipient(
        db,
        current_user.id,
        )
        )

        unread_notifications = len(
        [
            notification
            for notification in notifications
            if not notification.is_read
        ]
        )

        return DashboardResponse(
        profile=profile,
        worker_profile=worker_profile,
        stats=DashboardStats(
            open_works=len(my_works),
            my_applications=len(
                my_applications,
            ),
            active_assignments=len(
                my_assignments,
            ),
            unread_notifications=(
                unread_notifications
            ),
        ),
        recent_notifications=notifications[:5],
        )