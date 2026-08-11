import uuid
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status
from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
)
from app.services.application_service import ApplicationService
from app.schemas.assignment import AssignmentResponse

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

service = ApplicationService()


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.apply(
        db,
        current_user,
        application,
    )


@router.get(
    "/my",
    response_model=list[ApplicationResponse],
)
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_my_applications(
        db,
        current_user,
    )


@router.get(
    "/work/{work_id}",
    response_model=list[ApplicationResponse],
)
def work_applications(
    work_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_work_applications(
        db,
        work_id,
        current_user,
    )
    
@router.put(
    "/{application_id}/accept",
    response_model=AssignmentResponse,
)
def accept_application(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.accept_application(
        db,
        application_id,
        current_user,
    )
    
@router.put(
    "/{application_id}/reject",
)
def reject_application(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
        return service.reject_application(
            db,
            application_id,
            current_user,
        )

    
@router.put(
    "/{application_id}/withdraw",
)
def withdraw_application(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
        return service.withdraw_application(
            db,
            application_id,
            current_user,
        )
