from dataclasses import dataclass


@dataclass
class Pagination:

    page: int = 1

    size: int = 10

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size