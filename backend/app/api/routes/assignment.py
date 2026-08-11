import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.assignment import AssignmentResponse
from app.services.assignment_service import AssignmentService


router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"],
)

service = AssignmentService()


@router.get(
    "/my",
    response_model=list[AssignmentResponse],
)
def get_my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_my_assignments(
        db,
        current_user,
    )


@router.get(
    "/{assignment_id}",
    response_model=AssignmentResponse,
)
def get_assignment(
    assignment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_assignment(
        db,
        assignment_id,
    )


@router.put(
    "/{assignment_id}/complete",
    response_model=AssignmentResponse,
)
def complete_assignment(
    assignment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.complete_assignment(
        db,
        assignment_id,
        current_user,
    )


@router.put(
    "/{assignment_id}/cancel",
    response_model=AssignmentResponse,
)
def cancel_assignment(
    assignment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.cancel_assignment(
        db,
        assignment_id,
        current_user,
    )