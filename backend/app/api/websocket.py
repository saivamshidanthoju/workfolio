from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.repositories.user_repository import UserRepository
from app.schemas.message import MessageCreate
from app.services.chat_service import ChatService
from app.services.message_service import MessageService
from app.websocket.auth import verify_websocket_token
from app.websocket.manager import manager


message_service = MessageService()
chat_service = ChatService()
user_repository = UserRepository()


async def websocket_endpoint(
    websocket: WebSocket,
    assignment_id: str,
):
    # -------------------------
    # Read JWT
    # -------------------------

    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    # -------------------------
    # Verify JWT
    # -------------------------

    user_id = verify_websocket_token(token)

    if not user_id:
        await websocket.close(code=1008)
        return

    # -------------------------
    # Database session
    # -------------------------

    db: Session = SessionLocal()

    try:
        # -------------------------
        # Get current user
        # -------------------------

        current_user = user_repository.get_by_id(
            db,
            user_id,
        )

        if not current_user:
            await websocket.close(code=1008)
            return

        # -------------------------
        # Validate assignment/chat access
        # -------------------------

        chat_service.get_chat(
            db=db,
            assignment_id=assignment_id,
            user_id=str(current_user.id),
        )

        # -------------------------
        # Connect
        # -------------------------

        await manager.connect(
            assignment_id,
            websocket,
        )

        print(
            f"User {current_user.email} "
            f"connected to assignment {assignment_id}",
        )

        # -------------------------
        # Receive messages
        # -------------------------

        while True:

            data = await websocket.receive_json()

            message_data = MessageCreate(
                message=data.get("message"),
                attachment=data.get("attachment"),
            )

            # -------------------------
            # Save message
            # -------------------------

            message = message_service.send_message(
                db=db,
                assignment_id=assignment_id,
                current_user=current_user,
                message_data=message_data,
            )

            # -------------------------
            # Broadcast saved message
            # -------------------------

            await manager.broadcast(
                assignment_id,
                {
                    "id": str(message.id),
                    "conversation_id": str(
                        message.conversation_id
                    ),
                    "sender_id": str(
                        message.sender_id
                    ),
                    "message": message.message,
                    "attachment": message.attachment,
                    "is_read": message.is_read,
                    "created_at": message.created_at.isoformat(),
                },
            )

    except WebSocketDisconnect:

        manager.disconnect(
            assignment_id,
            websocket,
        )

        print(
            f"User {user_id} disconnected "
            f"from assignment {assignment_id}",
        )

    finally:

        db.close()