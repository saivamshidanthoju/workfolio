from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.dependencies import (
    get_current_user,
    get_db,
)
from app.models.user import User
from app.models.work import Work
from app.models.assignment import Assignment
from app.models.worker_profile import WorkerProfile
from app.models.enums import AssignmentStatus
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


@router.get(
    "/public-stats",
)
def get_public_stats(db: Session = Depends(get_db)):
    total_talents = db.query(WorkerProfile).count()
    total_jobs = db.query(Work).count()
    total_assignments = db.query(Assignment).count()
    
    # Calculate total payout released for completed assignments
    total_payout = db.query(func.sum(Assignment.accepted_budget))\
        .filter(Assignment.status == AssignmentStatus.COMPLETED)\
        .scalar() or 0
        
    return {
        "total_talents": total_talents,
        "total_jobs": total_jobs,
        "total_assignments": total_assignments,
        "total_released": float(total_payout),
    }