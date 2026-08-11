import uuid

from sqlalchemy.orm import Session

from app.core.exceptions import (
    ForbiddenException,
    NotFoundException,
)
from app.models.user import User
from app.models.work import Work
from app.repositories.work_repository import WorkRepository
from app.schemas.work import (
    WorkCreate,
    WorkUpdate,
)
from app.schemas.work_filter import WorkFilter
from app.utils.pagination import Pagination


class WorkService:

    def __init__(self):
        self.repository = WorkRepository()

    def create_work(
        self,
        db: Session,
        current_user: User,
        work_data: WorkCreate,
    ) -> Work:

        work = Work(
            owner_id=current_user.id,
            **work_data.model_dump(),
        )

        return self.repository.create(
            db,
            work,
        )

    def get_work(
        self,
        db: Session,
        work_id: uuid.UUID,
    ) -> Work:

        work = self.repository.get_by_id(
            db,
            work_id,
        )

        if not work or work.is_deleted:
            raise NotFoundException(
                "Work not found."
            )

        return work

    def get_my_works(
        self,
        db: Session,
        current_user: User,
    ) -> list[Work]:

        return self.repository.get_by_owner(
            db,
            current_user.id,
        )

    def update_work(
        self,
        db: Session,
        work_id: uuid.UUID,
        work_data: WorkUpdate,
        current_user: User,
    ) -> Work:

        work = self.get_work(
            db,
            work_id,
        )

        if work.owner_id != current_user.id:
            raise ForbiddenException(
                "You can only edit your own work."
            )

        updates = work_data.model_dump(
            exclude_unset=True,
        )

        for key, value in updates.items():
            setattr(
                work,
                key,
                value,
            )

        return self.repository.update(
            db,
            work,
        )

    def delete_work(
        self,
        db: Session,
        work_id: uuid.UUID,
        current_user: User,
    ) -> None:

        work = self.get_work(
            db,
            work_id,
        )

        if work.owner_id != current_user.id:
            raise ForbiddenException(
                "You can only delete your own work."
            )

        self.repository.delete(
            db,
            work,
        )

    def search_works(
        self,
        db: Session,
        filters: WorkFilter,
        pagination: Pagination,
    ):

        return self.repository.search(
            db,
            filters,
            pagination,
        )