from typing import Any

from fastapi.responses import JSONResponse


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
        },
    )


def created_response(
    data: Any = None,
    message: str = "Created successfully",
):
    return success_response(
        data=data,
        message=message,
        status_code=201,
    )