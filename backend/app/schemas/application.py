import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ApplicationStatus


class ApplicationCreate(BaseModel):
    work_id: uuid.UUID

    proposal: str = Field(
        min_length=20,
        max_length=3000,
    )

    expected_budget: float = Field(
        gt=0,
    )


class ApplicationUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    id: uuid.UUID

    work_id: uuid.UUID

    worker_id: uuid.UUID

    proposal: str

    expected_budget: float

    status: ApplicationStatus

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )