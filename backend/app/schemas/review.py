from uuid import UUID

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    assignment_id: UUID
    reviewee_id: UUID
    rating: int = Field(
        ge=1,
        le=5,
    )
    comment: str


class ReviewResponse(BaseModel):
    id: UUID
    assignment_id: UUID
    reviewer_id: UUID
    reviewee_id: UUID
    rating: int
    comment: str

    class Config:
        from_attributes = True