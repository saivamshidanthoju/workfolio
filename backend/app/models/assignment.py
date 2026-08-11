from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import AssignmentStatus


class Assignment(BaseModel):
    __tablename__ = "assignments"

    work_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("works.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    worker_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    accepted_budget: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    status: Mapped[AssignmentStatus] = mapped_column(
        Enum(AssignmentStatus),
        default=AssignmentStatus.ACTIVE,
        nullable=False,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # -------------------------
    # Relationships
    # -------------------------

    work: Mapped["Work"] = relationship(
        "Work",
        back_populates="assignment",
    )

    client: Mapped["User"] = relationship(
        "User",
        foreign_keys=[client_id],
        back_populates="client_assignments",
    )

    worker: Mapped["User"] = relationship(
        "User",
        foreign_keys=[worker_id],
        back_populates="worker_assignments",
    )

    conversation: Mapped["Conversation | None"] = relationship(
        "Conversation",
        back_populates="assignment",
        uselist=False,
        cascade="all, delete-orphan",
    )

    review: Mapped["Review | None"] = relationship(
        "Review",
        back_populates="assignment",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"<Assignment(work_id={self.work_id}, "
            f"worker_id={self.worker_id})>"
        )