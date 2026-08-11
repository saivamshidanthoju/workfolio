import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.work import (
    WorkCreate,
    WorkResponse,
    WorkUpdate,
)
from app.schemas.work_filter import WorkFilter
from app.services.work_service import WorkService
from app.utils.pagination import Pagination

router = APIRouter(
    prefix="/works",
    tags=["Works"],
)

service = WorkService()


@router.post(
    "",
    response_model=WorkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_work(
    work: WorkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.create_work(
        db,
        current_user,
        work,
    )


@router.get(
    "",
    response_model=list[WorkResponse],
)
def get_works(
    search: str | None = None,
    category: str | None = None,
    location: str | None = None,
    budget_min: float | None = None,
    budget_max: float | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):

    filters = WorkFilter(
        search=search,
        category=category,
        location=location,
        budget_min=budget_min,
        budget_max=budget_max,
    )

    pagination = Pagination(
        page=page,
        size=size,
    )

    return service.search_works(
        db,
        filters,
        pagination,
    )


@router.get(
    "/my-posts",
    response_model=list[WorkResponse],
)
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_my_works(
        db,
        current_user,
    )


@router.get(
    "/{work_id}",
    response_model=WorkResponse,
)
def get_work(
    work_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    return service.get_work(
        db,
        work_id,
    )


@router.put(
    "/{work_id}",
    response_model=WorkResponse,
)
def update_work(
    work_id: uuid.UUID,
    work: WorkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.update_work(
        db,
        work_id,
        work,
        current_user,
    )


@router.delete(
    "/{work_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_work(
    work_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service.delete_work(
        db,
        work_id,
        current_user,
    )