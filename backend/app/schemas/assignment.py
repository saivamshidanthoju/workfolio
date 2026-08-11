import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import AssignmentStatus


class AssignmentResponse(BaseModel):

    id: uuid.UUID

    work_id: uuid.UUID

    client_id: uuid.UUID

    worker_id: uuid.UUID

    accepted_budget: float

    status: AssignmentStatus

    started_at: datetime | None

    completed_at: datetime | None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )