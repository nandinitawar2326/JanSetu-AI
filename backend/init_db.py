import sys
from pathlib import Path

import pandas as pd

sys.path.append(str(Path(__file__).parent))

from database import engine, SessionLocal, Base
from models import (
    Department,
    Scheme,
    Location,
    Budget,
    Beneficiary,
    Outcome
)


DATA_DIR = Path(__file__).parent.parent / "data"


def load_csv(filename):
    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")

    return pd.read_csv(path)


def initialize_database():

    print("\n===================================")
    print("INITIALIZING JANSETU DATABASE")
    print("===================================\n")

    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:

        # --------------------------------
        # Departments
        # --------------------------------

        departments = load_csv("departments.csv")

        for _, row in departments.iterrows():

            db.add(
                Department(
                    department_id=row["department_id"],
                    department_name=row["department_name"],
                    ministry=row["ministry"]
                )
            )

        print(f"✓ Departments loaded: {len(departments)}")


        # --------------------------------
        # Schemes
        # --------------------------------

        schemes = load_csv("schemes.csv")

        for _, row in schemes.iterrows():

            db.add(
                Scheme(
                    scheme_id=row["scheme_id"],
                    scheme_name=row["scheme_name"],
                    department_id=row["department_id"],
                    category=row["category"],
                    target_group=row["target_group"]
                )
            )

        print(f"✓ Schemes loaded: {len(schemes)}")


        # --------------------------------
        # Locations
        # --------------------------------

        locations = load_csv("locations.csv")

        for _, row in locations.iterrows():

            db.add(
                Location(
                    district_id=row["district_id"],
                    district=row["district"],
                    state=row["state"],
                    population=int(row["population"]),
                    rural_population=int(row["rural_population"]),
                    infrastructure_index=float(
                        row["infrastructure_index"]
                    )
                )
            )

        print(f"✓ Locations loaded: {len(locations)}")


        # --------------------------------
        # Budgets
        # --------------------------------

        budgets = load_csv("budgets.csv")

        for _, row in budgets.iterrows():

            db.add(
                Budget(
                    scheme_id=row["scheme_id"],
                    district_id=row["district_id"],
                    year=int(row["year"]),
                    allocated_budget_lakh=float(
                        row["allocated_budget_lakh"]
                    ),
                    released_budget_lakh=float(
                        row["released_budget_lakh"]
                    ),
                    utilized_budget_lakh=float(
                        row["utilized_budget_lakh"]
                    )
                )
            )

        print(f"✓ Budgets loaded: {len(budgets)}")


        # --------------------------------
        # Beneficiaries
        # --------------------------------

        beneficiaries = load_csv("beneficiaries.csv")

        for _, row in beneficiaries.iterrows():

            db.add(
                Beneficiary(
                    scheme_id=row["scheme_id"],
                    district_id=row["district_id"],
                    year=int(row["year"]),
                    target_beneficiaries=int(
                        row["target_beneficiaries"]
                    ),
                    actual_beneficiaries=int(
                        row["actual_beneficiaries"]
                    )
                )
            )

        print(
            f"✓ Beneficiaries loaded: {len(beneficiaries)}"
        )


        # --------------------------------
        # Outcomes
        # --------------------------------

        outcomes = load_csv("outcomes.csv")

        for _, row in outcomes.iterrows():

            db.add(
                Outcome(
                    scheme_id=row["scheme_id"],
                    district_id=row["district_id"],
                    year=int(row["year"]),
                    completion_rate=float(
                        row["completion_rate"]
                    ),
                    outcome_score=float(
                        row["outcome_score"]
                    ),
                    satisfaction_score=float(
                        row["satisfaction_score"]
                    )
                )
            )

        print(f"✓ Outcomes loaded: {len(outcomes)}")


        # Save everything
        db.commit()

        print("\n===================================")
        print("DATABASE INITIALIZED SUCCESSFULLY")
        print("===================================\n")

    except Exception as e:

        db.rollback()

        print("\nERROR:")
        print(e)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    initialize_database()