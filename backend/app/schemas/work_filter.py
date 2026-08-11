from pydantic import BaseModel


class WorkFilter(BaseModel):

    search: str | None = None

    category: str | None = None

    location: str | None = None

    budget_min: float | None = None

    budget_max: float | None = None