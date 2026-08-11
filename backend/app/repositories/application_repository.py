import uuid

from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.enums import ApplicationStatus


class ApplicationRepository:

    def create(
        self,
        db: Session,
        application: Application,
    ) -> Application:
        db.add(application)
        db.commit()
        db.refresh(application)
        return application

    def get_by_id(
    self,
    db: Session,
    application_id: uuid.UUID,
) -> Application | None:
        return (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.is_deleted == False,
        )
        .first()
        )

    def get_by_work_and_worker(
        self,
        db: Session,
        work_id: uuid.UUID,
        worker_id: uuid.UUID,
    ) -> Application | None:

        return (
            db.query(Application)
            .filter(
                Application.work_id == work_id,
                Application.worker_id == worker_id,
                Application.is_deleted == False,
            )
            .first()
        )

    def get_by_worker(
        self,
        db: Session,
        worker_id: uuid.UUID,
    ) -> list[Application]:

        return (
            db.query(Application)
            .filter(
                Application.worker_id == worker_id,
                Application.is_deleted == False,
            )
            .order_by(Application.created_at.desc())
            .all()
        )

    def get_by_work(
        self,
        db: Session,
        work_id: uuid.UUID,
    ) -> list[Application]:

        return (
            db.query(Application)
            .filter(
                Application.work_id == work_id,
                Application.is_deleted == False,
            )
            .order_by(Application.created_at.desc())
            .all()
        )

    def update(
        self,
        db: Session,
        application: Application,
    ) -> Application:
        db.commit()
        db.refresh(application)
        return application

    def delete(
        self,
        db: Session,
        application: Application,
    ) -> None:

        application.is_deleted = True
        db.commit()

    def reject_other_applications(
        self,
        db: Session,
        work_id: uuid.UUID,
        accepted_application_id: uuid.UUID,
    ) -> None:

        (
            db.query(Application)
            .filter(
    Application.work_id == work_id,
    Application.id != accepted_application_id,
    Application.status == ApplicationStatus.PENDING,
    Application.is_deleted == False,
)   
            .update(
                {
                    Application.status: ApplicationStatus.REJECTED,
                },
                synchronize_session=False,
            )
        )

        db.commit()