import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def calculate_performance():

    beneficiaries = pd.read_csv(
        DATA_DIR / "beneficiaries.csv"
    )

    budgets = pd.read_csv(
        DATA_DIR / "budgets.csv"
    )

    outcomes = pd.read_csv(
        DATA_DIR / "outcomes.csv"
    )

    locations = pd.read_csv(
        DATA_DIR / "locations.csv"
    )

    schemes = pd.read_csv(
        DATA_DIR / "schemes.csv"
    )

    # -------------------------------
    # Beneficiary Coverage
    # -------------------------------

    beneficiaries["coverage_percentage"] = (
        beneficiaries["actual_beneficiaries"]
        / beneficiaries["target_beneficiaries"]
        * 100
    )

    # -------------------------------
    # Budget Utilization
    # -------------------------------

    budgets["utilization_percentage"] = (
        budgets["utilized_budget_lakh"]
        / budgets["allocated_budget_lakh"]
        * 100
    )

    # -------------------------------
    # Merge beneficiary + budget
    # -------------------------------

    result = beneficiaries.merge(
        budgets[
            [
                "scheme_id",
                "district_id",
                "utilization_percentage"
            ]
        ],
        on=["scheme_id", "district_id"],
        how="inner"
    )

    # -------------------------------
    # Add outcomes
    # -------------------------------

    result = result.merge(
        outcomes[
            [
                "scheme_id",
                "district_id",
                "outcome_score",
                "completion_rate",
                "satisfaction_score"
            ]
        ],
        on=["scheme_id", "district_id"],
        how="inner"
    )

    # -------------------------------
    # Add location information
    # -------------------------------

    result = result.merge(
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

    # -------------------------------
    # Add scheme information
    # -------------------------------

    result = result.merge(
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

    # -------------------------------
    # Round input metrics
    # -------------------------------

    result["coverage_percentage"] = (
        result["coverage_percentage"].round(2)
    )

    result["utilization_percentage"] = (
        result["utilization_percentage"].round(2)
    )

    result["outcome_score"] = (
        result["outcome_score"].round(2)
    )

    # -------------------------------
    # JanSetu Composite Performance
    # -------------------------------

    result["performance_score"] = (
        0.40 * result["coverage_percentage"]
        + 0.30 * result["utilization_percentage"]
        + 0.30 * result["outcome_score"]
    )

    result["performance_score"] = (
        result["performance_score"].round(2)
    )

    # -------------------------------
    # Classification
    # -------------------------------

    def classify(score):

        if score >= 75:
            return "High"

        elif score >= 55:
            return "Moderate"

        else:
            return "Low"

    result["performance_level"] = (
        result["performance_score"]
        .apply(classify)
    )

    return result[
        [
            "scheme_id",
            "scheme_name",
            "department_id",
            "district_id",
            "district",
            "coverage_percentage",
            "utilization_percentage",
            "outcome_score",
            "completion_rate",
            "satisfaction_score",
            "infrastructure_index",
            "performance_score",
            "performance_level"
        ]
    ]


if __name__ == "__main__":

    result = calculate_performance()

    print("\n===================================")
    print("JANSETU PERFORMANCE ANALYSIS")
    print("===================================\n")

    print(result.to_string(index=False))
