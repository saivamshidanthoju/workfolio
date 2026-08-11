from sqlalchemy.orm import Session

from app.core.exceptions import (
    ForbiddenException,
    NotFoundException,
)
from app.models.enums import AssignmentStatus
from app.models.review import Review
from app.models.user import User
from app.repositories.assignment_repository import (
    AssignmentRepository,
)
from app.repositories.review_repository import (
    ReviewRepository,
)
from app.repositories.worker_profile_repository import (
    WorkerProfileRepository,
)
from app.schemas.review import ReviewCreate

class ReviewService:

    def __init__(self):

        self.review_repository = ReviewRepository()

        self.assignment_repository = (
            AssignmentRepository()
        )

        self.worker_profile_repository = (
            WorkerProfileRepository()
        )

    def create_review(
    self,
    db: Session,
    current_user: User,
    review_data: ReviewCreate,
    ):
        assignment = self.assignment_repository.get_by_id(
    db,
    review_data.assignment_id,
    )

        if not assignment:
            raise NotFoundException(
        "Assignment not found."
        )
    
        if assignment.status != AssignmentStatus.COMPLETED:
            raise ForbiddenException(
        "Assignment is not completed."
        )

        if current_user.id not in (
        assignment.client_id,
        assignment.worker_id,
        ):
            raise ForbiddenException(
        "You are not part of this assignment."
        )

        existing_review = (
        self.review_repository.get_by_assignment_and_reviewer(
        db,
        review_data.assignment_id,
        current_user.id,
        )
        )

        if existing_review:
            raise ForbiddenException(
        "You have already reviewed this assignment."
        )

        review = Review(
        assignment_id=review_data.assignment_id,
        reviewer_id=current_user.id,
        reviewee_id=review_data.reviewee_id,
        rating=review_data.rating,
        comment=review_data.comment,
        )

        review = self.review_repository.create(
        db,
        review,
        )

        reviews = self.review_repository.get_by_reviewee(
        db,
        review_data.reviewee_id,
        )

        average_rating = (
        sum(r.rating for r in reviews)
        / len(reviews)
        )

        worker_profile = (
        self.worker_profile_repository.get_by_user_id(
        db,
        review_data.reviewee_id,
        )
        )

        if worker_profile:

            worker_profile.average_rating = average_rating

            worker_profile.completed_works += 1

            self.worker_profile_repository.update(
            db,
            worker_profile,
            )

        return review
    
    def get_reviews(
    self,
    db: Session,
    user_id,
    ):

        return self.review_repository.get_by_reviewee(
        db,
        user_id,
        )