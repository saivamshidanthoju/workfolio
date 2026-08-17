import sys
import os
from datetime import datetime, timedelta

# Ensure parent directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import (
    User,
    Profile,
    WorkerProfile,
    Work,
    Assignment,
    Application,
    Notification,
    Review,
)
from app.models.enums import (
    WorkStatus,
    WorkType,
    BudgetType,
    ApplicationStatus,
    AssignmentStatus,
    AvailabilityStatus,
)
from app.core.security import hash_password

def seed_db():
    print("Seeding database...")
    db = SessionLocal()
    
    try:
        # Clear existing tables (optional, clean start)
        db.query(Review).delete()
        db.query(Notification).delete()
        db.query(Assignment).delete()
        db.query(Application).delete()
        db.query(Work).delete()
        db.query(WorkerProfile).delete()
        db.query(Profile).delete()
        db.query(User).delete()
        db.commit()
        print("Cleared old data.")
        
        # Create users
        hashed = hash_password("password123")
        
        # User 1: Client Julia
        julia = User(email="julia@workbridge.io", password_hash=hashed, is_verified=True)
        db.add(julia)
        db.flush() # get Julia ID
        
        julia_profile = Profile(
            user_id=julia.id,
            full_name="Julia Myers",
            phone="+1 (555) 019-2834",
            bio="Product Lead at Apex Digital Group. Always looking for top-notch developers.",
            location="San Francisco, CA",
        )
        db.add(julia_profile)
        
        # User 2: Worker Alex
        alex = User(email="alex@workbridge.io", password_hash=hashed, is_verified=True)
        db.add(alex)
        db.flush()
        
        alex_profile = Profile(
            user_id=alex.id,
            full_name="Alex Rivera",
            phone="+1 (555) 014-9988",
            bio="Full Stack Developer specialized in React Native, FastAPI, and Postgres.",
            location="Austin, TX",
        )
        db.add(alex_profile)
        
        alex_worker = WorkerProfile(
            user_id=alex.id,
            headline="Senior Mobile & Backend Engineer",
            skills="React Native, React, TypeScript, FastAPI, PostgreSQL, AWS",
            experience_years=6,
            hourly_rate=85.0,
            availability=AvailabilityStatus.AVAILABLE,
            portfolio_url="https://alexrivera.dev",
            github_url="https://github.com/alexrivera",
            linkedin_url="https://linkedin.com/in/alexrivera",
            average_rating=4.9,
            completed_works=14,
            is_verified=True,
        )
        db.add(alex_worker)
        
        # User 3: Worker John
        john = User(email="john@workbridge.io", password_hash=hashed, is_verified=True)
        db.add(john)
        db.flush()
        
        john_profile = Profile(
            user_id=john.id,
            full_name="John Doe",
            phone="+1 (555) 012-3456",
            bio="UI/UX Developer focused on creating beautiful, accessible web applications.",
            location="New York, NY",
        )
        db.add(john_profile)
        
        john_worker = WorkerProfile(
            user_id=john.id,
            headline="Frontend Architect & UI Developer",
            skills="React, Tailwind CSS, Framer Motion, Figma, Next.js",
            experience_years=4,
            hourly_rate=70.0,
            availability=AvailabilityStatus.BUSY,
            portfolio_url="https://johndoe.design",
            github_url="https://github.com/johndoe",
            linkedin_url="https://linkedin.com/in/johndoe",
            average_rating=4.8,
            completed_works=8,
            is_verified=True,
        )
        db.add(john_worker)
        
        db.flush()
        
        # Create Works (Job Postings)
        work1 = Work(
            owner_id=julia.id,
            title="React Native Expert Required",
            description="Looking for an experienced React Native developer to help complete our mobile application checkout flow. Must have solid TypeScript skills.",
            category="Mobile Development",
            work_type=WorkType.REMOTE,
            budget=2400.0,
            budget_type=BudgetType.FIXED,
            location="Remote",
            deadline=datetime.utcnow() + timedelta(days=14),
            status=WorkStatus.IN_PROGRESS,
        )
        
        work2 = Work(
            owner_id=julia.id,
            title="Senior FastAPI Backend Setup",
            description="Need a modular, scalable FastAPI backend setup with PostgreSQL and Alembic migrations. Clean code and tests are required.",
            category="Backend Development",
            work_type=WorkType.REMOTE,
            budget=950.0,
            budget_type=BudgetType.FIXED,
            location="Remote",
            deadline=datetime.utcnow() + timedelta(days=7),
            status=WorkStatus.COMPLETED,
        )
        
        work3 = Work(
            owner_id=julia.id,
            title="Landing Page Visual Rewrite",
            description="We want to upgrade our landing page to have modern animations, premium layouts, and clean CSS styling. Using Tailwind is a plus.",
            category="Frontend Development",
            work_type=WorkType.HYBRID,
            budget=450.0,
            budget_type=BudgetType.FIXED,
            location="New York, NY",
            deadline=datetime.utcnow() + timedelta(days=20),
            status=WorkStatus.OPEN,
        )
        
        db.add(work1)
        db.add(work2)
        db.add(work3)
        db.flush()
        
        # Create applications
        app1 = Application(
            work_id=work1.id,
            worker_id=alex.id,
            proposal="I have built 10+ React Native apps and can complete this checkout flow cleanly in 5 days.",
            expected_budget=2400.0,
            status=ApplicationStatus.ACCEPTED,
        )
        app2 = Application(
            work_id=work2.id,
            worker_id=alex.id,
            proposal="FastAPI is my primary stack. I can deliver a clean setup with tests and Alembic setup.",
            expected_budget=950.0,
            status=ApplicationStatus.ACCEPTED,
        )
        app3 = Application(
            work_id=work3.id,
            worker_id=john.id,
            proposal="I specialize in UI visual rewrites and clean animations. Let's make this page pop!",
            expected_budget=450.0,
            status=ApplicationStatus.PENDING,
        )
        
        db.add(app1)
        db.add(app2)
        db.add(app3)
        db.flush()
        
        # Create assignments
        assign1 = Assignment(
            work_id=work1.id,
            client_id=julia.id,
            worker_id=alex.id,
            accepted_budget=2400.0,
            status=AssignmentStatus.ACTIVE,
            started_at=datetime.utcnow() - timedelta(days=2),
        )
        
        assign2 = Assignment(
            work_id=work2.id,
            client_id=julia.id,
            worker_id=alex.id,
            accepted_budget=950.0,
            status=AssignmentStatus.COMPLETED,
            started_at=datetime.utcnow() - timedelta(days=10),
            completed_at=datetime.utcnow() - timedelta(days=3),
        )
        
        db.add(assign1)
        db.add(assign2)
        db.flush()
        
        # Add a review for assignment 2
        review = Review(
            assignment_id=assign2.id,
            reviewer_id=julia.id,
            reviewee_id=alex.id,
            rating=5.0,
            comment="Alex did a spectacular job. The FastAPI code is beautiful and fully documented!",
        )
        db.add(review)
        
        db.commit()
        print("Database successfully seeded with real test records!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
