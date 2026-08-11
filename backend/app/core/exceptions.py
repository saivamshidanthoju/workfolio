class WorkBridgeException(Exception):
    """Base exception for WorkBridge."""

    def __init__(
        self,
        message: str,
    ):
        self.message = message
        super().__init__(message)


class NotFoundException(WorkBridgeException):
    """Resource not found."""


class ConflictException(WorkBridgeException):
    """Conflict with current state."""


class ForbiddenException(WorkBridgeException):
    """Operation not permitted."""


class ValidationException(WorkBridgeException):
    """Validation failed."""


class AuthenticationException(WorkBridgeException):
    """Authentication failed."""