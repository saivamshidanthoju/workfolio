from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.models.profile import Profile
from app.models.user import User
from app.repositories.profile_repository import (
    ProfileRepository,
)
from app.schemas.profile import (
    ProfileUpdate,
)
from fastapi import UploadFile
from app.services.upload_service import UploadService


class ProfileService:

    def __init__(self):
        self.profile_repository = (
            ProfileRepository()
        )
        self.upload_service = UploadService()

    def get_my_profile(
        self,
        db: Session,
        current_user: User,
    ) -> Profile:

        profile = self.profile_repository.get_by_user_id(
            db,
            current_user.id,
        )

        if not profile:

            profile = Profile(
                user_id=current_user.id,
            )

            profile = self.profile_repository.create(
                db,
                profile,
            )

        return profile

    def update_profile(
        self,
        db: Session,
        current_user: User,
        profile_data: ProfileUpdate,
    ) -> Profile:

        profile = self.get_my_profile(
            db,
            current_user,
        )

        update_data = profile_data.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(
                profile,
                field,
                value,
            )

        return self.profile_repository.update(
            db,
            profile,
        )

    def update_profile_image(
    self,
    db: Session,
    current_user: User,
    file: UploadFile,
    ):

        profile = self.get_my_profile(
        db,
        current_user,
        )

        image = self.upload_service.save_file(
        file,
        "profile",
        )

        profile.profile_image = image["file_url"]

        return self.profile_repository.update(
        db,
        profile,
        )
    
    def get_profile_by_user_id(
    self,
    db: Session,
    user_id,
    ) -> Profile:

        profile = (
        self.profile_repository.get_by_user_id_public(
            db,
            user_id,
        )
        )

        if not profile:
            raise NotFoundException(
            "Profile not found."
        )

        return profile