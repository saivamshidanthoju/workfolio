from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        # room_id -> list of websocket connections
        self.rooms: dict[
            str,
            list[WebSocket],
        ] = defaultdict(list)

    async def connect(
        self,
        room_id: str,
        websocket: WebSocket,
    ):

        await websocket.accept()

        self.rooms[room_id].append(
            websocket,
        )

    def disconnect(
        self,
        room_id: str,
        websocket: WebSocket,
    ):

        if room_id not in self.rooms:
            return

        if websocket in self.rooms[room_id]:
            self.rooms[room_id].remove(
                websocket,
            )

        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(
        self,
        room_id: str,
        message: dict,
    ):

        if room_id not in self.rooms:
            return

        disconnected = []

        for websocket in self.rooms[room_id]:

            try:
                await websocket.send_json(
                    message,
                )

            except Exception:
                disconnected.append(
                    websocket,
                )

        for websocket in disconnected:
            self.disconnect(
                room_id,
                websocket,
            )


manager = ConnectionManager()