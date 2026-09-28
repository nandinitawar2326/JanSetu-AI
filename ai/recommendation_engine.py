from .performance_analysis import calculate_performance
from .gap_detection import detect_geographic_gaps


def generate_recommendations():

    performance = calculate_performance()
    geographic_gaps = detect_geographic_gaps()

    recommendations = []

    # --------------------------------
    # Scheme-level recommendations
    # --------------------------------

    for _, row in performance.iterrows():

        actions = []
        evidence = []

        coverage = row["coverage_percentage"]
        utilization = row["utilization_percentage"]
        outcome = row["outcome_score"]
        infrastructure = row["infrastructure_index"]

        if coverage < 50:
            evidence.append(
                f"Beneficiary coverage is {coverage:.2f}%"
            )
            actions.append(
                "Review beneficiary outreach and enrollment coverage"
            )

        if utilization < 50:
            evidence.append(
                f"Budget utilization is {utilization:.2f}%"
            )
            actions.append(
                "Review resource deployment and implementation progress"
            )

        if outcome < 55:
            evidence.append(
                f"Outcome score is {outcome:.2f}"
            )
            actions.append(
                "Review implementation outcomes and delivery bottlenecks"
            )

        if infrastructure < 55:
            evidence.append(
                f"Infrastructure index is {infrastructure:.2f}"
            )
            actions.append(
                "Assess infrastructure constraints affecting delivery"
            )

        if actions:

            recommendations.append({
                "type": "SCHEME",
                "district": row["district"],
                "scheme_name": row["scheme_name"],
                "priority": (
                    "HIGH"
                    if len(actions) >= 3
                    else "MEDIUM"
                ),
                "actions": actions,
                "evidence": evidence
            })

    # --------------------------------
    # Geographic recommendations
    # --------------------------------

    for _, row in geographic_gaps.iterrows():

        if row["gap_level"] in ["HIGH", "MEDIUM"]:

            recommendations.append({
                "type": "GEOGRAPHIC",
                "district": row["district"],
                "scheme_name": "Multiple schemes",
                "priority": row["gap_level"],
                "actions": [
                    "Review cross-scheme beneficiary coverage",
                    "Investigate district-level implementation constraints"
                ],
                "evidence": [
                    (
                        f"Average coverage is "
                        f"{row['average_coverage']:.2f}%"
                    ),
                    (
                        f"{row['schemes_below_50']} of "
                        f"{row['schemes_analyzed']} schemes "
                        f"are below 50% coverage"
                    ),
                    (
                        f"Infrastructure index is "
                        f"{row['infrastructure_index']:.2f}"
                    )
                ]
            })

    return recommendations


if __name__ == "__main__":

    recommendations = generate_recommendations()

    print("\n===================================")
    print("JANSETU RECOMMENDATION ENGINE")
    print("===================================\n")

    print(
        f"Generated {len(recommendations)} "
        f"recommendation signals.\n"
    )

    for recommendation in recommendations:

        print("-----------------------------------")

        print(
            f"Type     : {recommendation['type']}"
        )

        print(
            f"District : {recommendation['district']}"
        )

        print(
            f"Scheme   : {recommendation['scheme_name']}"
        )

        print(
            f"Priority : {recommendation['priority']}"
        )

        print("\nSuggested actions:")

        for action in recommendation["actions"]:
            print(f"  - {action}")

        print("\nEvidence:")

        for evidence in recommendation["evidence"]:
            print(f"  - {evidence}")

        print()


