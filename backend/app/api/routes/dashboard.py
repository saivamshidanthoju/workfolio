from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    get_db,
)
from app.models.user import User
from app.schemas.dashboard import (
    DashboardResponse,
)
from app.services.dashboard_service import (
    DashboardService,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

service = DashboardService()


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return service.get_dashboard(
        db,
        current_user,
    )