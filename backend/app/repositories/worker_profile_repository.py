from sqlalchemy.orm import Session

from app.models.worker_profile import WorkerProfile


class WorkerProfileRepository:

    def get_by_user_id(
        self,
        db: Session,
        user_id,
    ) -> WorkerProfile | None:

        return (
            db.query(WorkerProfile)
            .filter(
                WorkerProfile.user_id == user_id,
                WorkerProfile.is_deleted == False,
            )
            .first()
        )

    def create(
        self,
        db: Session,
        worker_profile: WorkerProfile,
    ) -> WorkerProfile:

        db.add(worker_profile)
        db.commit()
        db.refresh(worker_profile)

        return worker_profile

    def update(
        self,
        db: Session,
        worker_profile: WorkerProfile,
    ) -> WorkerProfile:

        db.commit()
        db.refresh(worker_profile)

        return worker_profile
    
    def get_public_by_user_id(
    self,
    db: Session,
    user_id,
) -> WorkerProfile | None:

        return (
        db.query(WorkerProfile)
        .filter(
            WorkerProfile.user_id == user_id,
            WorkerProfile.is_deleted == False,
        )
        .first()
        )