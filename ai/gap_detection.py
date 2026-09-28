import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def detect_geographic_gaps():

    beneficiaries = pd.read_csv(
        DATA_DIR / "beneficiaries.csv"
    )

    locations = pd.read_csv(
        DATA_DIR / "locations.csv"
    )

    schemes = pd.read_csv(
        DATA_DIR / "schemes.csv"
    )

    # Calculate coverage
    beneficiaries["coverage_percentage"] = (
        beneficiaries["actual_beneficiaries"]
        / beneficiaries["target_beneficiaries"]
        * 100
    )

    # Add scheme information
    data = beneficiaries.merge(
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

    # Add district information
    data = data.merge(
        locations[
            [
                "district_id",
                "district",
                "state",
                "population",
                "rural_population",
                "infrastructure_index"
            ]
        ],
        on="district_id",
        how="left"
    )

    # District-level aggregation
    district_summary = (
        data
        .groupby(
            [
                "district_id",
                "district",
                "state"
            ]
        )
        .agg(
            average_coverage=(
                "coverage_percentage",
                "mean"
            ),
            schemes_below_50=(
                "coverage_percentage",
                lambda x: (x < 50).sum()
            ),
            schemes_analyzed=(
                "scheme_id",
                "count"
            )
        )
        .reset_index()
    )

    # Add infrastructure and population
    district_summary = district_summary.merge(
        locations[
            [
                "district_id",
                "population",
                "rural_population",
                "infrastructure_index"
            ]
        ],
        on="district_id",
        how="left"
    )

    district_summary["average_coverage"] = (
        district_summary["average_coverage"].round(2)
    )

    # Geographic gap classification
    def classify_gap(row):

        if (
            row["average_coverage"] < 55
            and row["schemes_below_50"] >= 2
        ):
            return "HIGH"

        elif (
            row["average_coverage"] < 65
            or row["schemes_below_50"] >= 2
        ):
            return "MEDIUM"

        else:
            return "LOW"

    district_summary["gap_level"] = (
        district_summary.apply(
            classify_gap,
            axis=1
        )
    )

    return district_summary[
        [
            "district_id",
            "district",
            "state",
            "population",
            "rural_population",
            "infrastructure_index",
            "average_coverage",
            "schemes_below_50",
            "schemes_analyzed",
            "gap_level"
        ]
    ]


if __name__ == "__main__":

    result = detect_geographic_gaps()

    print("\n===================================")
    print("JANSETU GEOGRAPHIC GAP DETECTION")
    print("===================================\n")

    print(
        result.to_string(index=False)
    )
