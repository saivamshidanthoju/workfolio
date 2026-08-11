import uuid

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.work import Work
from app.models.enums import WorkStatus
from app.utils.pagination import Pagination
from app.schemas.work_filter import WorkFilter

class WorkRepository:

    def create(
        self,
        db: Session,
        work: Work,
    ) -> Work:
        db.add(work)
        db.commit()
        db.refresh(work)
        return work

    def get_by_id(
    self,
    db: Session,
    work_id: uuid.UUID,
) -> Work | None:
        return (
        db.query(Work)
        .filter(
            Work.id == work_id,
            Work.is_deleted == False,
        )
        .first()
        )

    def get_all_open(
        self,
        db: Session,
    ) -> list[Work]:
        return (
            db.query(Work)
            .filter(
                Work.status == WorkStatus.OPEN,
                Work.is_deleted == False,
            )
            .order_by(Work.created_at.desc())
            .all()
        )

    def get_by_owner(
    self,
    db: Session,
    owner_id: uuid.UUID,
    ) -> list[Work]:
        return (
            db.query(Work)
            .filter(
                Work.owner_id == owner_id,
                Work.is_deleted == False,
            )
            .order_by(Work.created_at.desc())
            .all()
        )

    def update(
        self,
        db: Session,
        work: Work,
    ) -> Work:
        db.commit()
        db.refresh(work)
        return work

    def delete(
        self,
        db: Session,
        work: Work,
    ) -> None:
        work.is_deleted = True
        db.commit()

    def get_open_works(
    self,
    db: Session,
    pagination: Pagination,
    ):

        return (
        db.query(Work)
        .filter(
            Work.status == WorkStatus.OPEN,
            Work.is_deleted == False,
        )
        .order_by(
            Work.created_at.desc(),
        )
        .offset(
            pagination.offset,
        )
        .limit(
            pagination.size,
        )
        .all()
        )
    
    def search(
    self,
    db: Session,
    filters: WorkFilter,
    pagination: Pagination,
    ):

        query = db.query(Work).filter(
        Work.is_deleted == False,
        Work.status == WorkStatus.OPEN,
        )

        if filters.search:
            query = query.filter(
            Work.title.ilike(
                f"%{filters.search}%"
            )
        )

        if filters.category:
            query = query.filter(
            Work.category == filters.category
        )

        if filters.location:
            query = query.filter(
            Work.location == filters.location
        )

        if filters.budget_min is not None:
            query = query.filter(
            Work.budget >= filters.budget_min
        )

        if filters.budget_max is not None:
            query = query.filter(
            Work.budget <= filters.budget_max
        )

        return (
        query.order_by(
            Work.created_at.desc(),
        )
        .offset(
            pagination.offset,
        )
        .limit(
            pagination.size,
        )
        .all()
        )