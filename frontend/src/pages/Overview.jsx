
import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Map,
  Database,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCoverage,
  getAnomalies,
  getGeographicGaps,
  getRecommendations,
} from "../services/api";

import "../styles/Overview.css";

function Overview() {
  const navigate = useNavigate();

  const [coverage, setCoverage] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [geographicGaps, setGeographicGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD OVERVIEW DATA
  ========================================================= */

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          coverageData,
          anomaliesData,
          geographicData,
          recommendationsData,
        ] = await Promise.all([
          getCoverage(),
          getAnomalies(),
          getGeographicGaps(),
          getRecommendations(),
        ]);

        setCoverage(
          Array.isArray(coverageData) ? coverageData : []
        );

        setAnomalies(
          Array.isArray(anomaliesData) ? anomaliesData : []
        );

        setGeographicGaps(
          Array.isArray(geographicData)
            ? geographicData
            : []
        );

        setRecommendations(
          Array.isArray(recommendationsData)
            ? recommendationsData
            : []
        );
      } catch (err) {
        console.error(
          "Overview data loading error:",
          err
        );

        setError(
          "Unable to load overview data from JanSetu AI backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  /* =========================================================
     CALCULATE STATISTICS
  ========================================================= */

  const activeSchemes = new Set(
    coverage
      .map((item) => item.scheme_name)
      .filter(Boolean)
  ).size;

  const districtsAnalyzed = new Set(
    coverage
      .map((item) => item.district)
      .filter(Boolean)
  ).size;

  const averageCoverage =
    coverage.length > 0
      ? coverage.reduce(
          (total, item) =>
            total +
            Number(
              item.coverage_percentage || 0
            ),
          0
        ) / coverage.length
      : 0;

  const averageCoverageText =
    averageCoverage > 0
      ? `${averageCoverage.toFixed(1)}%`
      : "0%";

  /* =========================================================
     INTELLIGENCE VALUES
  ========================================================= */

  const anomalyCount = anomalies.length;

  const geographicGapCount = geographicGaps.filter(
    (item) =>
      item.gap_level &&
      String(item.gap_level).toUpperCase() !== "LOW"
  ).length;

  const overlapCount = recommendations.filter(
    (item) =>
      item.type &&
      String(item.type).toUpperCase() === "GEOGRAPHIC"
  ).length;

  /* =========================================================
     PRIORITY SIGNALS
  ========================================================= */

  const prioritySignals = recommendations
    .filter(
      (item) =>
        String(item.type).toUpperCase() === "SCHEME"
    )
    .filter(
      (item) =>
        String(item.priority).toUpperCase() === "HIGH" ||
        String(item.priority).toUpperCase() === "MEDIUM"
    )
    .slice(0, 3)
    .map((item) => {
      let signal = "Implementation requires review";

      if (
        Array.isArray(item.evidence) &&
        item.evidence.length > 0
      ) {
        signal = item.evidence[0];
      }

      return {
        priority: String(
          item.priority || "MEDIUM"
        ).toUpperCase(),

        scheme:
          item.scheme_name ||
          "Government Scheme",

        district:
          item.district ||
          "Unknown District",

        signal,
      };
    });

  /* =========================================================
     FALLBACK PRIORITY SIGNALS
  ========================================================= */

  const finalPrioritySignals =
    prioritySignals.length > 0
      ? prioritySignals
      : [
          {
            priority: "MEDIUM",
            scheme: "No immediate priority signal",
            district: "—",
            signal:
              "No high-priority administrative signal is currently available.",
          },
        ];

  /* =========================================================
     INTELLIGENCE CARDS
  ========================================================= */

  const intelligenceCards = [
    {
      icon: Users,
      title: "Beneficiary Coverage",
      value: averageCoverageText,
      description:
        "Monitor beneficiary reach across government schemes.",
      path: "/schemes",
    },

    {
      icon: AlertTriangle,
      title: "Anomalies Detected",
      value: String(anomalyCount),
      description:
        "AI-detected implementation signals requiring attention.",
      path: "/anomalies",
    },

    {
      icon: Map,
      title: "Geographic Gaps",
      value: String(geographicGapCount),
      description:
        "Identify districts with service delivery gaps.",
      path: "/districts",
    },

    {
      icon: Database,
      title: "Scheme Overlaps",
      value: String(overlapCount),
      description:
        "Detect overlapping schemes and departments.",
      path: "/recommendations",
    },
  ];

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = [
    {
      icon: Activity,
      value: String(activeSchemes),
      label: "Active Schemes",
    },

    {
      icon: Map,
      value: String(districtsAnalyzed),
      label: "Districts Analyzed",
    },

    {
      icon: Database,
      value: String(coverage.length),
      label: "Coverage Records",
    },

    {
      icon: TrendingUp,
      value: averageCoverageText,
      label: "Average Coverage",
    },
  ];

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="overview-page">

        <div className="overview-header">

          <div>
            <div className="overview-breadcrumb">
              HOME / OVERVIEW
            </div>

            <h1>Governance Overview</h1>

            <p>
              AI-powered intelligence for monitoring
              government schemes, beneficiaries and
              implementation performance.
            </p>
          </div>

          <div className="overview-live-status">
            <span className="overview-live-dot"></span>

            <div>
              <small>DATA STATUS</small>
              <strong>LOADING</strong>
            </div>
          </div>

        </div>

        <div className="overview-state">
          Loading governance intelligence...
        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="overview-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="overview-header">

        <div>

          <div className="overview-breadcrumb">
            HOME / OVERVIEW
          </div>

          <h1>
            Governance Overview
          </h1>

          <p>
            AI-powered intelligence for monitoring
            government schemes, beneficiaries and
            implementation performance.
          </p>

        </div>

        <div className="overview-live-status">

          <span className="overview-live-dot"></span>

          <div>

            <small>
              DATA STATUS
            </small>

            <strong>
              {error ? "ERROR" : "LIVE"}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="overview-error">
          {error}
        </div>
      )}


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="overview-hero">

        <div className="overview-hero-content">

          <span className="overview-label">
            JANSETU INTELLIGENCE
          </span>

          <h2>
            From Government Data to Actionable Insights
          </h2>

          <p>
            JanSetu AI analyzes scheme performance,
            beneficiary coverage, resource utilization,
            geographic gaps, anomalies and scheme
            overlaps to support better implementation
            decisions.
          </p>

        </div>


        <div className="overview-hero-stat">

          <strong>
            {activeSchemes}
          </strong>

          <span>
            Active Schemes
          </span>


          <div className="overview-stat-divider"></div>


          <strong>
            {districtsAnalyzed}
          </strong>

          <span>
            Districts Analyzed
          </span>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="overview-statistics">

        {statistics.map((stat, index) => {

          const Icon = stat.icon;

          return (
            <div
              className="overview-stat-card"
              key={index}
            >

              <div className="overview-stat-icon">
                <Icon size={21} />
              </div>

              <div>

                <strong>
                  {stat.value}
                </strong>

                <span>
                  {stat.label}
                </span>

              </div>

            </div>
          );
        })}

      </section>


      {/* =====================================================
          AI INTELLIGENCE
      ===================================================== */}

      <section className="overview-section">

        <div className="overview-section-heading">

          <div>

            <h2>
              AI Intelligence Overview
            </h2>

            <p>
              Key signals generated from governance
              datasets.
            </p>

          </div>

        </div>


        <div className="overview-intelligence-grid">

          {intelligenceCards.map(
            (card, index) => {

              const Icon = card.icon;

              return (

                <div
                  className="overview-intelligence-card"
                  key={index}
                  onClick={() =>
                    navigate(card.path)
                  }
                >

                  <div className="overview-card-top">

                    <div className="overview-card-icon">
                      <Icon size={22} />
                    </div>

                    <strong className="overview-card-value">
                      {card.value}
                    </strong>

                  </div>


                  <h3>
                    {card.title}
                  </h3>


                  <p>
                    {card.description}
                  </p>


                  <button
                    type="button"
                    className="overview-view-button"
                    onClick={(event) => {

                      event.stopPropagation();

                      navigate(card.path);

                    }}
                  >

                    View analysis

                    <ArrowRight size={14} />

                  </button>

                </div>

              );
            }
          )}

        </div>

      </section>


      {/* =====================================================
          PRIORITY ATTENTION
      ===================================================== */}

      <section className="overview-priority">

        <div className="overview-priority-heading">

          <div>

            <span className="overview-label">
              PRIORITY ATTENTION
            </span>

            <h2>
              AI-generated signals requiring
              administrative review
            </h2>

          </div>

          <AlertTriangle size={24} />

        </div>


        <div className="overview-priority-list">

          {finalPrioritySignals.map(
            (item, index) => (

              <div
                className="overview-priority-item"
                key={index}
              >

                <span
                  className={`overview-priority-badge ${
                    item.priority === "HIGH"
                      ? "high"
                      : "medium"
                  }`}
                >
                  {item.priority}
                </span>


                <div className="overview-priority-info">

                  <strong>
                    {item.scheme}
                  </strong>

                  <span>
                    {item.district}
                  </span>

                </div>


                <p>
                  {item.signal}
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/recommendations")
                  }
                >

                  Review

                  <ArrowRight size={14} />

                </button>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}

export default Overview;

