from enum import Enum


class WorkStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class WorkType(str, Enum):
    ONSITE = "ONSITE"
    REMOTE = "REMOTE"
    HYBRID = "HYBRID"


class BudgetType(str, Enum):
    FIXED = "FIXED"
    HOURLY = "HOURLY"


class ApplicationStatus(str, Enum):
    PENDING = "PENDING"
    SHORTLISTED = "SHORTLISTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class AssignmentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    DISPUTED = "DISPUTED"


class NotificationType(str, Enum):
    APPLICATION = "APPLICATION"
    ASSIGNMENT = "ASSIGNMENT"
    MESSAGE = "MESSAGE"
    REVIEW = "REVIEW"
    SYSTEM = "SYSTEM"


class AvailabilityStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    BUSY = "BUSY"
    OFFLINE = "OFFLINE"

class ReviewType(str, Enum):
    CLIENT_TO_WORKER = "CLIENT_TO_WORKER"
    WORKER_TO_CLIENT = "WORKER_TO_CLIENT"