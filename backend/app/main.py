
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes.auth import router as auth_router
from app.core.config import settings
from app.api.routes.work import router as work_router
from app.api.routes.application import router as application_router
from app.core.handlers import register_exception_handlers
from app.api.routes.chat import router as chat_router
from app.api.routes.message import router as message_router
from app.api.websocket import websocket_endpoint
from fastapi import FastAPI, WebSocket
from app.api.websocket import websocket_endpoint
from app.api.routes.notification import router as notification_router
from app.api.routes.upload import router as upload_router
from app.api.routes.profile import router as profile_router
from app.api.routes.worker_profile import (
    router as worker_profile_router,
)
from app.api.routes.review import router as review_router
from app.api.routes.dashboard import (
    router as dashboard_router,
)
from app.api.routes.ai import router as ai_router
from app.api.websocket import websocket_endpoint

from app.api.routes.assignment import router as assignment_router

app = FastAPI(
    title=settings.APP_NAME,
    version="2.0.0",
    description="WorkBridge Backend API",
)
register_exception_handlers(app)
# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Routes
# -------------------------

app.include_router(auth_router)
app.include_router(work_router)
app.include_router(application_router)
app.include_router(assignment_router)
app.include_router(chat_router)
app.include_router(message_router)
app.include_router(notification_router)
app.include_router(upload_router)
app.include_router(profile_router)
app.include_router(worker_profile_router)
app.include_router(review_router)
app.include_router(
    dashboard_router,
)
app.include_router(ai_router)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# -------------------------
# Root
# -------------------------

@app.get("/")
def root():
    return {
        "message": "Welcome to WorkBridge API 🚀",
        "version": "2.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }

@app.websocket("/ws/{assignment_id}")
async def websocket_chat(
    websocket: WebSocket,
    assignment_id: str,
):

    await websocket_endpoint(
        websocket,
        assignment_id,
    )