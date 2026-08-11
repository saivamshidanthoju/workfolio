from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
)
from app.services.profile_service import ProfileService
from uuid import UUID

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)

service = ProfileService()


@router.get(
    "",
    response_model=ProfileResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_my_profile(
        db,
        current_user,
    )


@router.put(
    "",
    response_model=ProfileResponse,
)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.update_profile(
        db,
        current_user,
        profile_data,
    )


@router.put(
    "/image",
    response_model=ProfileResponse,
)
def update_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.update_profile_image(
        db,
        current_user,
        file,
    )

@router.get(
    "/{user_id}",
    response_model=ProfileResponse,
)
def get_profile_by_user_id(
    user_id: UUID,
    db: Session = Depends(get_db),
):

    return service.get_profile_by_user_id(
        db,
        user_id,
    )