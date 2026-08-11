from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    AuthenticationException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ValidationException,
)


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(NotFoundException)
    async def not_found_handler(
        request: Request,
        exc: NotFoundException,
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": exc.message,
                "data": None,
            },
        )

    @app.exception_handler(ConflictException)
    async def conflict_handler(
        request: Request,
        exc: ConflictException,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": exc.message,
                "data": None,
            },
        )

    @app.exception_handler(ForbiddenException)
    async def forbidden_handler(
        request: Request,
        exc: ForbiddenException,
    ):
        return JSONResponse(
            status_code=403,
            content={
                "success": False,
                "message": exc.message,
                "data": None,
            },
        )

    @app.exception_handler(ValidationException)
    async def validation_handler(
        request: Request,
        exc: ValidationException,
    ):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": exc.message,
                "data": None,
            },
        )

    @app.exception_handler(AuthenticationException)
    async def authentication_handler(
        request: Request,
        exc: AuthenticationException,
    ):
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": exc.message,
                "data": None,
            },
        )