import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from fastapi import APIRouter

from ai.coverage_analysis import calculate_coverage
from ai.resource_analysis import calculate_resource_utilization
from ai.performance_analysis import calculate_performance
from ai.anomaly_detection import detect_anomalies
from ai.gap_detection import detect_geographic_gaps
from ai.overlap_detection import detect_scheme_overlaps
from ai.recommendation_engine import generate_recommendations


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Intelligence"]
)


@router.get("/coverage")
def get_coverage():

    result = calculate_coverage()

    return result.to_dict(orient="records")


@router.get("/resources")
def get_resources():

    result = calculate_resource_utilization()

    return result.to_dict(orient="records")


@router.get("/performance")
def get_performance():

    result = calculate_performance()

    return result.to_dict(orient="records")


@router.get("/anomalies")
def get_anomalies():

    return detect_anomalies()


@router.get("/geographic-gaps")
def get_geographic_gaps():

    result = detect_geographic_gaps()

    return result.to_dict(orient="records")


@router.get("/overlaps")
def get_overlaps():

    result = detect_scheme_overlaps()

    return result.to_dict(orient="records")


@router.get("/recommendations")
def get_recommendations():

    return generate_recommendations()
