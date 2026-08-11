from fastapi import APIRouter, File, UploadFile

from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

service = UploadService()


@router.post(
    "/profile",
    response_model=UploadResponse,
)
def upload_profile(
    file: UploadFile = File(...),
):

    return service.save_file(
        file,
        "profile",
    )


@router.post(
    "/work",
    response_model=UploadResponse,
)
def upload_work(
    file: UploadFile = File(...),
):

    return service.save_file(
        file,
        "work",
    )


@router.post(
    "/chat",
    response_model=UploadResponse,
)
def upload_chat(
    file: UploadFile = File(...),
):

    return service.save_file(
        file,
        "chat",
    )