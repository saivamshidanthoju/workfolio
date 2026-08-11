from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    get_db,
)
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewResponse,
)
from app.services.review_service import (
    ReviewService,
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)

service = ReviewService()


@router.post(
    "",
    response_model=ReviewResponse,
)
def create_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.create_review(
        db,
        current_user,
        review_data,
    )


@router.get(
    "/{user_id}",
    response_model=list[ReviewResponse],
)
def get_reviews(
    user_id: UUID,
    db: Session = Depends(get_db),
):

    return service.get_reviews(
        db,
        user_id,
    )