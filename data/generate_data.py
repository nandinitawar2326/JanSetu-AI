import pandas as pd
import numpy as np
from pathlib import Path

np.random.seed(42)

DATA_DIR = Path(__file__).parent


# ============================================================
# 1. DEPARTMENTS
# ============================================================

departments = pd.DataFrame([
    {
        "department_id": "D001",
        "department_name": "Rural Development",
        "ministry": "Ministry of Rural Development"
    },
    {
        "department_id": "D002",
        "department_name": "Health & Family Welfare",
        "ministry": "Ministry of Health & Family Welfare"
    },
    {
        "department_id": "D003",
        "department_name": "School Education",
        "ministry": "Ministry of Education"
    },
    {
        "department_id": "D004",
        "department_name": "Women & Child Development",
        "ministry": "Ministry of Women & Child Development"
    },
    {
        "department_id": "D005",
        "department_name": "Skill Development",
        "ministry": "Ministry of Skill Development"
    }
])


# ============================================================
# 2. SCHEMES
# ============================================================

schemes = pd.DataFrame([
    {
        "scheme_id": "S001",
        "scheme_name": "Rural Housing Support",
        "department_id": "D001",
        "category": "Housing",
        "target_group": "Rural Families"
    },
    {
        "scheme_id": "S002",
        "scheme_name": "Rural Health Access",
        "department_id": "D002",
        "category": "Healthcare",
        "target_group": "Rural Families"
    },
    {
        "scheme_id": "S003",
        "scheme_name": "Digital School Access",
        "department_id": "D003",
        "category": "Education",
        "target_group": "Students"
    },
    {
        "scheme_id": "S004",
        "scheme_name": "Women Skill Initiative",
        "department_id": "D004",
        "category": "Skill Development",
        "target_group": "Women"
    },
    {
        "scheme_id": "S005",
        "scheme_name": "Youth Skill Connect",
        "department_id": "D005",
        "category": "Skill Development",
        "target_group": "Youth"
    },
    {
        "scheme_id": "S006",
        "scheme_name": "Community Nutrition Mission",
        "department_id": "D004",
        "category": "Nutrition",
        "target_group": "Women & Children"
    },
    {
        "scheme_id": "S007",
        "scheme_name": "Rural Employment Support",
        "department_id": "D001",
        "category": "Employment",
        "target_group": "Rural Families"
    },
    {
        "scheme_id": "S008",
        "scheme_name": "District Health Infrastructure",
        "department_id": "D002",
        "category": "Healthcare",
        "target_group": "General Population"
    }
])


# ============================================================
# 3. LOCATIONS
# ============================================================

locations = pd.DataFrame([
    {
        "district_id": "MH01",
        "district": "Pune",
        "state": "Maharashtra",
        "population": 3200000,
        "rural_population": 850000,
        "infrastructure_index": 82
    },
    {
        "district_id": "MH02",
        "district": "Nashik",
        "state": "Maharashtra",
        "population": 2800000,
        "rural_population": 1500000,
        "infrastructure_index": 68
    },
    {
        "district_id": "MH03",
        "district": "Solapur",
        "state": "Maharashtra",
        "population": 2200000,
        "rural_population": 1300000,
        "infrastructure_index": 51
    },
    {
        "district_id": "MH04",
        "district": "Satara",
        "state": "Maharashtra",
        "population": 1600000,
        "rural_population": 1050000,
        "infrastructure_index": 63
    },
    {
        "district_id": "MH05",
        "district": "Kolhapur",
        "state": "Maharashtra",
        "population": 1500000,
        "rural_population": 850000,
        "infrastructure_index": 76
    },
    {
        "district_id": "MH06",
        "district": "Nagpur",
        "state": "Maharashtra",
        "population": 2500000,
        "rural_population": 700000,
        "infrastructure_index": 79
    }
])


# ============================================================
# 4. BUDGET DATA
# ============================================================

budget_rows = []

for _, scheme in schemes.iterrows():
    for _, location in locations.iterrows():

        allocated = np.random.randint(80, 500)

        # Deliberately create a few anomalies
        if scheme["scheme_id"] == "S004" and location["district"] == "Solapur":
            allocated = 450

        if scheme["scheme_id"] == "S008" and location["district"] == "Nashik":
            allocated = 420

        utilization_rate = np.random.uniform(0.55, 0.95)

        # Deliberately low utilization in some areas
        if (
            scheme["scheme_id"] == "S004"
            and location["district"] == "Solapur"
        ):
            utilization_rate = 0.38

        if (
            scheme["scheme_id"] == "S008"
            and location["district"] == "Nashik"
        ):
            utilization_rate = 0.44

        released = round(allocated * np.random.uniform(0.85, 1.0), 2)
        utilized = round(released * utilization_rate, 2)

        budget_rows.append({
            "scheme_id": scheme["scheme_id"],
            "district_id": location["district_id"],
            "year": 2026,
            "allocated_budget_lakh": allocated,
            "released_budget_lakh": released,
            "utilized_budget_lakh": utilized
        })

budgets = pd.DataFrame(budget_rows)


# ============================================================
# 5. BENEFICIARY DATA
# ============================================================

beneficiary_rows = []

for _, scheme in schemes.iterrows():
    for _, location in locations.iterrows():

        target = np.random.randint(3000, 20000)

        coverage_rate = np.random.uniform(0.55, 0.95)

        # Deliberately create geographic coverage gaps
        if (
            location["district"] == "Solapur"
            and scheme["scheme_id"] in ["S001", "S002", "S007"]
        ):
            coverage_rate = np.random.uniform(0.30, 0.48)

        if (
            location["district"] == "Nashik"
            and scheme["scheme_id"] == "S008"
        ):
            coverage_rate = 0.42

        actual = int(target * coverage_rate)

        beneficiary_rows.append({
            "scheme_id": scheme["scheme_id"],
            "district_id": location["district_id"],
            "year": 2026,
            "target_beneficiaries": target,
            "actual_beneficiaries": actual
        })

beneficiaries = pd.DataFrame(beneficiary_rows)


# ============================================================
# 6. OUTCOME DATA
# ============================================================

outcome_rows = []

for _, scheme in schemes.iterrows():
    for _, location in locations.iterrows():

        completion_rate = np.random.uniform(0.55, 0.95)
        outcome_score = np.random.uniform(55, 92)
        satisfaction_score = np.random.uniform(55, 95)

        # Deliberately create under-performance
        if (
            location["district"] == "Solapur"
            and scheme["scheme_id"] in ["S001", "S002", "S007"]
        ):
            completion_rate = np.random.uniform(0.35, 0.50)
            outcome_score = np.random.uniform(40, 55)
            satisfaction_score = np.random.uniform(40, 58)

        outcome_rows.append({
            "scheme_id": scheme["scheme_id"],
            "district_id": location["district_id"],
            "year": 2026,
            "completion_rate": round(completion_rate, 3),
            "outcome_score": round(outcome_score, 2),
            "satisfaction_score": round(satisfaction_score, 2)
        })

outcomes = pd.DataFrame(outcome_rows)


# ============================================================
# SAVE DATA
# ============================================================

departments.to_csv(DATA_DIR / "departments.csv", index=False)
schemes.to_csv(DATA_DIR / "schemes.csv", index=False)
locations.to_csv(DATA_DIR / "locations.csv", index=False)
budgets.to_csv(DATA_DIR / "budgets.csv", index=False)
beneficiaries.to_csv(DATA_DIR / "beneficiaries.csv", index=False)
outcomes.to_csv(DATA_DIR / "outcomes.csv", index=False)


print("\n===================================")
print("JANSETU AI DATA GENERATED")
print("===================================\n")

print(f"Departments:   {len(departments)}")
print(f"Schemes:       {len(schemes)}")
print(f"Locations:     {len(locations)}")
print(f"Budget rows:   {len(budgets)}")
print(f"Beneficiary:   {len(beneficiaries)}")
print(f"Outcome rows:  {len(outcomes)}")

print("\nFiles created successfully.")