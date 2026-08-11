from sqlalchemy.orm import Session

from app.models.review import Review


class ReviewRepository:

    def create(
        self,
        db: Session,
        review: Review,
    ) -> Review:

        db.add(review)
        db.commit()
        db.refresh(review)

        return review

    def get_by_reviewee(
        self,
        db: Session,
        reviewee_id,
    ):

        return (
            db.query(Review)
            .filter(
                Review.reviewee_id == reviewee_id,
                Review.is_deleted == False,
            )
            .all()
        )

    def get_by_assignment_and_reviewer(
        self,
        db: Session,
        assignment_id,
        reviewer_id,
    ):

        return (
            db.query(Review)
            .filter(
                Review.assignment_id == assignment_id,
                Review.reviewer_id == reviewer_id,
                Review.is_deleted == False,
            )
            .first()
        )