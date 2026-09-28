from .performance_analysis import calculate_performance


def detect_anomalies():

    data = calculate_performance()

    anomalies = []

    for _, row in data.iterrows():

        reasons = []

        coverage = row["coverage_percentage"]
        utilization = row["utilization_percentage"]
        outcome = row["outcome_score"]
        infrastructure = row["infrastructure_index"]

        # Signal 1: Low beneficiary reach
        if coverage < 50:
            reasons.append(
                f"Beneficiary coverage is only {coverage:.2f}%"
            )

        # Signal 2: Low resource utilization
        if utilization < 50:
            reasons.append(
                f"Budget utilization is only {utilization:.2f}%"
            )

        # Signal 3: Low outcome
        if outcome < 55:
            reasons.append(
                f"Outcome score is {outcome:.2f}"
            )

        # Signal 4: Infrastructure constraint
        if infrastructure < 55:
            reasons.append(
                f"Infrastructure index is {infrastructure:.2f}"
            )

        # Require at least two independent signals
        if len(reasons) >= 2:

            if len(reasons) >= 3:
                severity = "HIGH"
            else:
                severity = "MEDIUM"

            anomalies.append({
                "scheme_id": row["scheme_id"],
                "scheme_name": row["scheme_name"],
                "department_id": row["department_id"],
                "district_id": row["district_id"],
                "district": row["district"],
                "severity": severity,
                "signal_count": len(reasons),
                "performance_score": row["performance_score"],
                "reasons": reasons
            })

    return anomalies


if __name__ == "__main__":

    anomalies = detect_anomalies()

    print("\n===================================")
    print("JANSETU ANOMALY DETECTION")
    print("===================================\n")

    if not anomalies:

        print("No multi-signal anomalies detected.")

    else:

        print(
            f"Detected {len(anomalies)} "
            f"potential anomalies.\n"
        )

        for anomaly in anomalies:

            print("-----------------------------------")

            print(
                f"District   : {anomaly['district']}"
            )

            print(
                f"Scheme     : {anomaly['scheme_name']}"
            )

            print(
                f"Severity   : {anomaly['severity']}"
            )

            print(
                f"Signals    : {anomaly['signal_count']}"
            )

            print(
                f"Performance: "
                f"{anomaly['performance_score']}"
            )

            print("\nEvidence:")

            for reason in anomaly["reasons"]:

                print(f"  - {reason}")

            print()

