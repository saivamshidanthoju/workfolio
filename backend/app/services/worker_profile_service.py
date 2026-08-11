from sqlalchemy.orm import Session

from app.models.user import User
from app.models.worker_profile import WorkerProfile
from app.repositories.worker_profile_repository import (
    WorkerProfileRepository,
)
from app.schemas.worker_profile import (
    WorkerProfileUpdate,
)
from app.core.exceptions import NotFoundException

class WorkerProfileService:

    def __init__(self):
        self.worker_profile_repository = (
            WorkerProfileRepository()
        )

    def get_my_worker_profile(
        self,
        db: Session,
        current_user: User,
    ) -> WorkerProfile:

        worker_profile = (
            self.worker_profile_repository.get_by_user_id(
                db,
                current_user.id,
            )
        )

        if not worker_profile:

            worker_profile = WorkerProfile(
                user_id=current_user.id,
            )

            worker_profile = (
                self.worker_profile_repository.create(
                    db,
                    worker_profile,
                )
            )

        return worker_profile

    def update_worker_profile(
        self,
        db: Session,
        current_user: User,
        worker_profile_data: WorkerProfileUpdate,
    ) -> WorkerProfile:

        worker_profile = (
            self.get_my_worker_profile(
                db,
                current_user,
            )
        )

        update_data = (
            worker_profile_data.model_dump(
                exclude_unset=True,
            )
        )

        for field, value in update_data.items():
            setattr(
                worker_profile,
                field,
                value,
            )

        return self.worker_profile_repository.update(
            db,
            worker_profile,
        )
    
    def get_worker_profile_by_user_id(
    self,
    db: Session,
    user_id,
) -> WorkerProfile:

        worker_profile = (
        self.worker_profile_repository.get_public_by_user_id(
            db,
            user_id,
        )
        )

        if not worker_profile:
            raise NotFoundException(
            "Worker profile not found."
        )

        return worker_profile