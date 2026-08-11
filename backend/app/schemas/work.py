import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import (
    BudgetType,
    WorkStatus,
    WorkType,
)


class WorkCreate(BaseModel):
    title: str = Field(
        min_length=5,
        max_length=200,
    )

    description: str = Field(
        min_length=20,
    )

    category: str = Field(
        min_length=2,
        max_length=100,
    )

    work_type: WorkType

    budget: float = Field(
        gt=0,
    )

    budget_type: BudgetType

    location: str | None = None

    deadline: datetime | None = None


class WorkUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=5,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        min_length=20,
    )

    category: str | None = None

    work_type: WorkType | None = None

    budget: float | None = Field(
        default=None,
        gt=0,
    )

    budget_type: BudgetType | None = None

    location: str | None = None

    deadline: datetime | None = None

    status: WorkStatus | None = None


class WorkResponse(BaseModel):
    id: uuid.UUID

    owner_id: uuid.UUID

    title: str

    description: str

    category: str

    work_type: WorkType

    budget: float

    budget_type: BudgetType

    location: str | None

    deadline: datetime | None

    status: WorkStatus

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )