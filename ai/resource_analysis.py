import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def calculate_resource_utilization():

    budgets = pd.read_csv(
        DATA_DIR / "budgets.csv"
    )

    locations = pd.read_csv(
        DATA_DIR / "locations.csv"
    )

    schemes = pd.read_csv(
        DATA_DIR / "schemes.csv"
    )

    budgets["utilization_percentage"] = (
        budgets["utilized_budget_lakh"]
        / budgets["allocated_budget_lakh"]
        * 100
    )

    budgets["release_percentage"] = (
        budgets["released_budget_lakh"]
        / budgets["allocated_budget_lakh"]
        * 100
    )

    budgets = budgets.merge(
        locations[
            [
                "district_id",
                "district",
                "state",
                "infrastructure_index"
            ]
        ],
        on="district_id",
        how="left"
    )

    budgets = budgets.merge(
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

    budgets["utilization_percentage"] = (
        budgets["utilization_percentage"].round(2)
    )

    budgets["release_percentage"] = (
        budgets["release_percentage"].round(2)
    )

    return budgets[
        [
            "scheme_id",
            "scheme_name",
            "department_id",
            "district_id",
            "district",
            "state",
            "allocated_budget_lakh",
            "released_budget_lakh",
            "utilized_budget_lakh",
            "release_percentage",
            "utilization_percentage",
            "infrastructure_index"
        ]
    ]


if __name__ == "__main__":

    result = calculate_resource_utilization()

    print("\n===================================")
    print("RESOURCE UTILIZATION ANALYSIS")
    print("===================================\n")

    print(result.to_string(index=False))
