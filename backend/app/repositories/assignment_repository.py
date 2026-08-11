import uuid

from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.enums import AssignmentStatus


class AssignmentRepository:

    def create(
        self,
        db: Session,
        assignment: Assignment,
    ) -> Assignment:
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    def get_by_id(
    self,
    db: Session,
    assignment_id: uuid.UUID,
) -> Assignment | None:
        return (
        db.query(Assignment)
        .filter(
            Assignment.id == assignment_id,
            Assignment.is_deleted == False,
        )
        .first()
    )

    def get_by_worker(
        self,
        db: Session,
        worker_id: uuid.UUID,
    ) -> list[Assignment]:

        return (
            db.query(Assignment)
            .filter(
                Assignment.worker_id == worker_id,
                Assignment.is_deleted == False,
            )
            .order_by(Assignment.created_at.desc())
            .all()
        )

    def get_by_client(
        self,
        db: Session,
        client_id: uuid.UUID,
    ) -> list[Assignment]:

        return (
            db.query(Assignment)
            .filter(
                Assignment.client_id == client_id,
                Assignment.is_deleted == False,
            )
            .order_by(Assignment.created_at.desc())
            .all()
        )

    def update(
        self,
        db: Session,
        assignment: Assignment,
    ) -> Assignment:
        db.commit()
        db.refresh(assignment)
        return assignment

    def complete(
        self,
        db: Session,
        assignment: Assignment,
    ) -> Assignment:

        assignment.status = AssignmentStatus.COMPLETED

        return self.update(
            db,
            assignment,
        )

    def cancel(
        self,
        db: Session,
        assignment: Assignment,
    ) -> Assignment:

        assignment.status = AssignmentStatus.CANCELLED

        return self.update(
            db,
            assignment,
        )