from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import BudgetType, WorkStatus, WorkType


class Work(BaseModel):
    __tablename__ = "works"

    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    work_type: Mapped[WorkType] = mapped_column(
        Enum(WorkType),
        default=WorkType.ONSITE,
        nullable=False,
    )

    budget: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    budget_type: Mapped[BudgetType] = mapped_column(
        Enum(BudgetType),
        default=BudgetType.FIXED,
        nullable=False,
    )

    is_negotiable: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    deadline: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    status: Mapped[WorkStatus] = mapped_column(
        Enum(WorkStatus),
        default=WorkStatus.OPEN,
        nullable=False,
    )

    # -------------------------
    # Relationships
    # -------------------------

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="works",
    )

    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="work",
        cascade="all, delete-orphan",
    )

    assignment: Mapped["Assignment | None"] = relationship(
        "Assignment",
        back_populates="work",
        uselist=False,
    )

    def __repr__(self) -> str:
        return f"<Work(title='{self.title}')>"