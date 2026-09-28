import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def detect_scheme_overlaps():

    schemes = pd.read_csv(
        DATA_DIR / "schemes.csv"
    )

    beneficiaries = pd.read_csv(
        DATA_DIR / "beneficiaries.csv"
    )

    locations = pd.read_csv(
        DATA_DIR / "locations.csv"
    )

    # Add beneficiary totals to each scheme
    scheme_stats = (
        beneficiaries
        .groupby("scheme_id")
        .agg(
            total_target=("target_beneficiaries", "sum"),
            total_actual=("actual_beneficiaries", "sum")
        )
        .reset_index()
    )

    data = schemes.merge(
        scheme_stats,
        on="scheme_id",
        how="left"
    )

    # Compare schemes belonging to the same department
    overlaps = []

    for i in range(len(data)):

        for j in range(i + 1, len(data)):

            scheme_a = data.iloc[i]
            scheme_b = data.iloc[j]

            if scheme_a["department_id"] != scheme_b["department_id"]:
                continue

            # Determine whether both schemes operate
            # across the same districts.
            districts_a = set(
                beneficiaries[
                    beneficiaries["scheme_id"] == scheme_a["scheme_id"]
                ]["district_id"]
            )

            districts_b = set(
                beneficiaries[
                    beneficiaries["scheme_id"] == scheme_b["scheme_id"]
                ]["district_id"]
            )

            common_districts = districts_a.intersection(
                districts_b
            )

            if len(common_districts) == 0:
                continue

            overlaps.append({
                "scheme_a": scheme_a["scheme_name"],
                "scheme_b": scheme_b["scheme_name"],
                "department_id": scheme_a["department_id"],
                "common_districts": len(common_districts),
                "overlap_percentage": round(
                    (
                        len(common_districts)
                        /
                        min(
                            len(districts_a),
                            len(districts_b)
                        )
                    ) * 100,
                    2
                )
            })

    return pd.DataFrame(overlaps)


if __name__ == "__main__":

    result = detect_scheme_overlaps()

    print("\n===================================")
    print("JANSETU SCHEME OVERLAP DETECTION")
    print("===================================\n")

    if result.empty:

        print("No potential scheme overlaps detected.")

    else:

        print(
            result.to_string(index=False)
        )
