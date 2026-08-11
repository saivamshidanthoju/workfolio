from uuid import UUID

from pydantic import BaseModel

from app.models.enums import AvailabilityStatus


class WorkerProfileUpdate(BaseModel):
    headline: str | None = None
    skills: str | None = None
    experience_years: int | None = None
    hourly_rate: float | None = None
    availability: AvailabilityStatus | None = None
    portfolio_url: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None


class WorkerProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    headline: str | None
    skills: str | None
    experience_years: int
    hourly_rate: float
    availability: AvailabilityStatus
    portfolio_url: str | None
    github_url: str | None
    linkedin_url: str | None
    average_rating: float
    completed_works: int
    is_verified: bool

    class Config:
        from_attributes = True