from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    get_db,
)
from app.models.user import User
from app.schemas.worker_profile import (
    WorkerProfileResponse,
    WorkerProfileUpdate,
)
from app.services.worker_profile_service import (
    WorkerProfileService,
)
from uuid import UUID

router = APIRouter(
    prefix="/worker-profile",
    tags=["Worker Profile"],
)

service = WorkerProfileService()


@router.get(
    "",
    response_model=WorkerProfileResponse,
)
def get_my_worker_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_my_worker_profile(
        db,
        current_user,
    )


@router.put(
    "",
    response_model=WorkerProfileResponse,
)
def update_worker_profile(
    worker_profile_data: WorkerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.update_worker_profile(
        db,
        current_user,
        worker_profile_data,
    )

@router.get(
    "/{user_id}",
    response_model=WorkerProfileResponse,
)
def get_worker_profile_by_user_id(
    user_id: UUID,
    db: Session = Depends(get_db),
):

    return service.get_worker_profile_by_user_id(
        db,
        user_id,
    )