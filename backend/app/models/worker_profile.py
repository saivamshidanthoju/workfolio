from __future__ import annotations

import uuid

from sqlalchemy import Enum, ForeignKey, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import AvailabilityStatus


class WorkerProfile(BaseModel):
    __tablename__ = "worker_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    headline: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    experience_years: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    hourly_rate: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False,
    )

    availability: Mapped[AvailabilityStatus] = mapped_column(
        Enum(AvailabilityStatus),
        default=AvailabilityStatus.AVAILABLE,
        nullable=False,
    )

    portfolio_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    github_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    linkedin_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    average_rating: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False,
    )

    completed_works: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="worker_profile",
    )

    def __repr__(self) -> str:
        return f"<WorkerProfile(user_id={self.user_id})>"