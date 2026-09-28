import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def calculate_coverage():

    beneficiaries = pd.read_csv(
        DATA_DIR / "beneficiaries.csv"
    )

    locations = pd.read_csv(
        DATA_DIR / "locations.csv"
    )

    schemes = pd.read_csv(
        DATA_DIR / "schemes.csv"
    )

    beneficiaries["coverage_percentage"] = (
        beneficiaries["actual_beneficiaries"]
        / beneficiaries["target_beneficiaries"]
        * 100
    )

    beneficiaries = beneficiaries.merge(
        locations[
            [
                "district_id",
                "district",
                "state"
            ]
        ],
        on="district_id",
        how="left"
    )

    beneficiaries = beneficiaries.merge(
        schemes[
            [
                "scheme_id",
                "scheme_name",
                "department_id"
            ]
        ],
        on="scheme_id",
        how="left"
    )

    beneficiaries["coverage_percentage"] = (
        beneficiaries["coverage_percentage"].round(2)
    )

    return beneficiaries[
        [
            "scheme_id",
            "scheme_name",
            "department_id",
            "district_id",
            "district",
            "state",
            "target_beneficiaries",
            "actual_beneficiaries",
            "coverage_percentage"
        ]
    ]


if __name__ == "__main__":

    result = calculate_coverage()

    print("\n===================================")
    print("BENEFICIARY COVERAGE ANALYSIS")
    print("===================================\n")

    print(result.to_string(index=False))
