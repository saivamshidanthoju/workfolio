import uuid

from jose import JWTError, jwt

from app.core.config import settings


def verify_websocket_token(
    token: str,
) -> str | None:

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[
                settings.ALGORITHM,
            ],
        )

        user_id = payload.get("sub")

        if not user_id:
            return None

        # Make sure the JWT subject is a valid user UUID
        uuid.UUID(str(user_id))

        return str(user_id)

    except (JWTError, ValueError):
        return None