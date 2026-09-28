
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd

from backend.ai_routes import router as ai_router


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="JanSetu AI",
    description="Cross-Ministry Governance & Impact Intelligence Platform",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5176",
          "https://jan-setu-9o6nagq5k-nandini2326.vercel.app"

        # Add your Vercel frontend URL here later
        # "https://your-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# AI ROUTES
# --------------------------------------------------

app.include_router(ai_router)


# --------------------------------------------------
# DATA DIRECTORY
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "JanSetu AI API is running",
        "status": "success"
    }


# --------------------------------------------------
# DEPARTMENTS
# --------------------------------------------------

@app.get("/api/departments")
def get_departments():

    file_path = DATA_DIR / "departments.csv"

    departments = pd.read_csv(file_path)

    return departments[
        [
            "department_id",
            "department_name",
            "ministry"
        ]
    ].to_dict(orient="records")


# --------------------------------------------------
# SCHEMES
# --------------------------------------------------

@app.get("/api/schemes")
def get_schemes():

    file_path = DATA_DIR / "schemes.csv"

    schemes = pd.read_csv(file_path)

    return schemes[
        [
            "scheme_id",
            "scheme_name",
            "department_id"
        ]
    ].to_dict(orient="records")


# --------------------------------------------------
# DISTRICTS
# --------------------------------------------------

@app.get("/api/districts")
def get_districts():

    file_path = DATA_DIR / "locations.csv"

    locations = pd.read_csv(file_path)

    return locations[
        [
            "district_id",
            "district",
            "state"
        ]
    ].to_dict(orient="records")
