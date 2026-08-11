from sqlalchemy.orm import Session

from app.models.profile import Profile


class ProfileRepository:

    def get_by_user_id(
        self,
        db: Session,
        user_id,
    ) -> Profile | None:

        return (
            db.query(Profile)
            .filter(
                Profile.user_id == user_id,
                Profile.is_deleted == False,
            )
            .first()
        )

    def create(
        self,
        db: Session,
        profile: Profile,
    ) -> Profile:

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    def update(
        self,
        db: Session,
        profile: Profile,
    ) -> Profile:

        db.commit()
        db.refresh(profile)

        return profile
    
    def get_by_user_id_public(
    self,
    db: Session,
    user_id,
    ) -> Profile | None:

        return (
        db.query(Profile)
        .filter(
            Profile.user_id == user_id,
            Profile.is_deleted == False,
        )
        .first()
        )