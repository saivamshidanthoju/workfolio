from __future__ import annotations

import uuid

from sqlalchemy import Enum, ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import ApplicationStatus


class Application(BaseModel):
    __tablename__ = "applications"

    __table_args__ = (
        UniqueConstraint(
            "work_id",
            "worker_id",
            name="uq_application_work_worker",
        ),
    )

    work_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("works.id", ondelete="CASCADE"),
        nullable=False,
    )

    worker_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    proposal: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    expected_budget: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus),
        default=ApplicationStatus.PENDING,
        nullable=False,
    )

    # -------------------------
    # Relationships
    # -------------------------

    work: Mapped["Work"] = relationship(
        "Work",
        back_populates="applications",
    )

    worker: Mapped["User"] = relationship(
        "User",
        back_populates="applications",
    )

    def __repr__(self) -> str:
        return (
            f"<Application(work_id={self.work_id}, "
            f"worker_id={self.worker_id})>"
        )