import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.exceptions import ValidationException


class UploadService:

    ALLOWED_EXTENSIONS = {
        ".jpg",
        ".jpeg",
        ".png",
    }

    MAX_FILE_SIZE = 5 * 1024 * 1024

    BASE_UPLOAD_DIR = Path("uploads")

    def validate_image(
        self,
        file: UploadFile,
    ) -> None:

        if not file.filename:
            raise ValidationException(
                "File name is required."
            )

        extension = Path(
            file.filename,
        ).suffix.lower()

        if extension not in self.ALLOWED_EXTENSIONS:
            raise ValidationException(
                "Only JPG, JPEG and PNG images are allowed."
            )

        file.file.seek(0, 2)

        size = file.file.tell()

        file.file.seek(0)

        if size > self.MAX_FILE_SIZE:
            raise ValidationException(
                "Image size cannot exceed 5 MB."
            )

    def save_file(
        self,
        file: UploadFile,
        folder: str,
    ) -> dict:

        self.validate_image(file)

        upload_dir = (
            self.BASE_UPLOAD_DIR / folder
        )

        upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension = Path(
            file.filename,
        ).suffix.lower()

        filename = (
            f"{uuid.uuid4()}{extension}"
        )

        file_path = (
            upload_dir / filename
        )

        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

        return {
            "file_name": filename,
            "file_path": str(
                file_path
            ).replace("\\", "/"),
            "file_url": (
                f"/uploads/{folder}/{filename}"
            ),
        }