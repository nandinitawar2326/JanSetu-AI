from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Department, Scheme, Location
from backend.ai_routes import router as ai_router


app = FastAPI(
    title="JanSetu AI",
    description="Cross-Ministry Governance & Impact Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "JanSetu AI API is running",
        "status": "success"
    }


@app.get("/api/departments")
def get_departments(db: Session = Depends(get_db)):

    departments = db.query(Department).all()

    return [
        {
            "department_id": department.department_id,
            "department_name": department.department_name,
            "ministry": department.ministry
        }
        for department in departments
    ]


@app.get("/api/schemes")
def get_schemes(db: Session = Depends(get_db)):

    schemes = db.query(Scheme).all()

    return [
        {
            "scheme_id": scheme.scheme_id,
            "scheme_name": scheme.scheme_name,
            "department_id": scheme.department_id
        }
        for scheme in schemes
    ]


@app.get("/api/districts")
def get_districts(db: Session = Depends(get_db)):

    districts = db.query(Location).all()

    return [
        {
            "district_id": district.district_id,
            "district": district.district,
            "state": district.state
        }
        for district in districts
    ]
