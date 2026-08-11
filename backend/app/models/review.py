from __future__ import annotations

import uuid

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Review(BaseModel):
    __tablename__ = "reviews"

    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name="ck_review_rating",
        ),
    )

    assignment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assignments.id", ondelete="CASCADE"),
        # unique=True,
        nullable=False,
    )

    reviewer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    reviewee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    comment: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # -------------------------
    # Relationships
    # -------------------------

    assignment: Mapped["Assignment"] = relationship(
        "Assignment",
        back_populates="review",
    )

    reviewer: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reviewer_id],
        back_populates="reviews_given",
    )

    reviewee: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reviewee_id],
        back_populates="reviews_received",
    )

    def __repr__(self) -> str:
        return (
            f"<Review(reviewer={self.reviewer_id}, "
            f"reviewee={self.reviewee_id}, rating={self.rating})>"
        )