from pydantic import BaseModel

from app.schemas.notification import NotificationResponse
from app.schemas.profile import ProfileResponse
from app.schemas.worker_profile import WorkerProfileResponse


class DashboardStats(BaseModel):
    open_works: int
    my_applications: int
    active_assignments: int
    unread_notifications: int


class DashboardResponse(BaseModel):
    profile: ProfileResponse
    worker_profile: WorkerProfileResponse | None
    stats: DashboardStats
    recent_notifications: list[NotificationResponse]