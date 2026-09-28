
import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Map,
  Database,
  TrendingUp,
  Users,
  Building2,
  RefreshCw,
  BarChart3
} from "lucide-react";

import { useLanguage } from "../services/LanguageContext";
import {
  getCoverage,
  getAnomalies,
  getGeographicGaps,
  getOverlaps,
  getRecommendations,
} from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {
  const { t } = useLanguage();

  /* =========================================================
     STATE
  ========================================================= */

  const [coverage, setCoverage] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [geographicGaps, setGeographicGaps] = useState([]);
  const [overlaps, setOverlaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD BACKEND DATA
  ========================================================= */

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        coverageData,
        anomaliesData,
        geographicData,
        overlapsData,
        recommendationsData,
      ] = await Promise.all([
        getCoverage(),
        getAnomalies(),
        getGeographicGaps(),
        getOverlaps(),
        getRecommendations(),
      ]);

      setCoverage(Array.isArray(coverageData) ? coverageData : []);
      setAnomalies(Array.isArray(anomaliesData) ? anomaliesData : []);
      setGeographicGaps(
        Array.isArray(geographicData) ? geographicData : []
      );
      setOverlaps(Array.isArray(overlapsData) ? overlapsData : []);
      setRecommendations(
        Array.isArray(recommendationsData)
          ? recommendationsData
          : []
      );
    } catch (err) {
      console.error("Dashboard API error:", err);

      setError(
        "Unable to load dashboard data from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  /* =========================================================
     CALCULATED DASHBOARD VALUES
  ========================================================= */

  const dashboardData = useMemo(() => {
    /*
      IMPORTANT:

      coverage.length = number of coverage records.

      In your backend:
      8 schemes × 6 districts = 48 records.

      Therefore we must NOT use coverage.length
      as the number of schemes.
    */

    const uniqueSchemes = new Set(
      coverage
        .map((item) => item?.scheme_id)
        .filter(Boolean)
    );

    const uniqueDistricts = new Set(
      coverage
        .map((item) => item?.district_id)
        .filter(Boolean)
    );

    /* -----------------------------------------
       BENEFICIARY COVERAGE
    ----------------------------------------- */

    const totalTarget = coverage.reduce(
      (sum, item) =>
        sum + Number(item?.target_beneficiaries || 0),
      0
    );

    const totalActual = coverage.reduce(
      (sum, item) =>
        sum + Number(item?.actual_beneficiaries || 0),
      0
    );

    const beneficiaryCoverage =
      totalTarget > 0
        ? (totalActual / totalTarget) * 100
        : 0;

    /* -----------------------------------------
       VALUES
    ----------------------------------------- */

    return {
      activeSchemes: uniqueSchemes.size,
      districtsAnalyzed: uniqueDistricts.size,
      beneficiaryCoverage,
      anomaliesCount: anomalies.length,
      geographicGapsCount: geographicGaps.length,
      overlapsCount: overlaps.length,
    };
  }, [
    coverage,
    anomalies,
    geographicGaps,
    overlaps,
  ]);

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const formatPercentage = (value) => {
    if (!Number.isFinite(value)) {
      return "0.0%";
    }

    return `${value.toFixed(1)}%`;
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      icon: Building2,
      label: t("activeSchemes") || "Active Schemes",
      value: dashboardData.activeSchemes,
      change: "",
    },
    {
      icon: Map,
      label: t("districtsAnalyzed") || "Districts Analyzed",
      value: dashboardData.districtsAnalyzed,
      change: "",
    },
    {
      icon: Users,
      label: t("coverage") || "Beneficiary Coverage",
      value: formatPercentage(
        dashboardData.beneficiaryCoverage
      ),
      change: "",
    },
    {
      icon: AlertTriangle,
      label: t("anomalies") || "Anomalies",
      value: dashboardData.anomaliesCount,
      change: "",
    },
  ];

  /* =========================================================
     AI INTELLIGENCE CARDS
  ========================================================= */

  const intelligenceCards = [
    {
      icon: Activity,
      title: t("coverage") || "Beneficiary Coverage",
      description:
        t("coverageDescription") ||
        "Monitor beneficiary reach across government schemes.",
      value: formatPercentage(
        dashboardData.beneficiaryCoverage
      ),
      path: "/schemes",
    },
    {
      icon: AlertTriangle,
      title: t("anomalies") || "Anomalies",
      description:
        t("anomaliesDescription") ||
        "AI-detected implementation signals requiring attention.",
      value: dashboardData.anomaliesCount,
      path: "/anomalies",
    },
    {
      icon: Map,
      title:
        t("geographicGaps") || "Geographic Gaps",
      description:
        t("geographicDescription") ||
        "Identify districts with service delivery gaps.",
      value: dashboardData.geographicGapsCount,
      path: "/districts",
    },
    {
      icon: Database,
      title: t("overlaps") || "Scheme Overlaps",
      description:
        t("overlapsDescription") ||
        "Detect overlapping schemes and departments.",
      value: dashboardData.overlapsCount,
      path: "/recommendations",
    },
  ];

  /* =========================================================
     PRIORITY ATTENTION
  ========================================================= */

  const priorityItems = useMemo(() => {
    if (!recommendations.length) {
      return [];
    }

    /*
      The recommendation API may return slightly
      different field names depending on the backend.

      We therefore safely check the common names.
    */

    return recommendations
      .slice(0, 3)
      .map((item) => {
        const priority =
          item?.priority ||
          item?.severity ||
          item?.level ||
          "MEDIUM";

        const district =
          item?.district ||
          item?.district_name ||
          "—";

        const scheme =
          item?.scheme_name ||
          item?.scheme ||
          item?.title ||
          "—";

        let signal =
          item?.signal ||
          item?.reason ||
          item?.message ||
          "";

        /*
          If backend gives supporting evidence instead
          of a signal, create a readable signal.
        */

        if (!signal) {
          if (
            item?.coverage_percentage !== undefined
          ) {
            signal = `Beneficiary coverage is ${Number(
              item.coverage_percentage
            ).toFixed(2)}%`;
          } else if (
            item?.infrastructure_index !== undefined
          ) {
            signal = `Infrastructure index is ${Number(
              item.infrastructure_index
            ).toFixed(2)}`;
          } else if (
            item?.budget_utilization !== undefined
          ) {
            signal = `Budget utilization is ${Number(
              item.budget_utilization
            ).toFixed(2)}%`;
          } else {
            signal = "Administrative review required";
          }
        }

        return {
          district,
          scheme,
          signal,
          priority: String(priority).toUpperCase(),
        };
      });
  }, [recommendations]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>
            <div className="dashboard-breadcrumb">
              {t("home") || "HOME"} / Dashboard
            </div>

            <h1>Governance Dashboard</h1>

            <p>
              AI-powered overview of government scheme
              implementation and performance.
            </p>
          </div>

        </div>

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <RefreshCw
            size={28}
            className="dashboard-loading-icon"
          />

          <p>Loading dashboard data...</p>
        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>
            <div className="dashboard-breadcrumb">
              {t("home") || "HOME"} / Dashboard
            </div>

            <h1>Governance Dashboard</h1>

            <p>
              AI-powered overview of government scheme
              implementation and performance.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={16} />
            Retry
          </button>

        </div>

        <div
          style={{
            padding: "30px",
            marginTop: "20px",
          }}
        >
          <strong>{error}</strong>
        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>

          <div className="dashboard-breadcrumb">
            {t("home") || "HOME"} / Dashboard
          </div>

          <h1>
            Governance Dashboard
          </h1>

          <p>
            AI-powered overview of government scheme
            implementation and performance.
          </p>

        </div>

        <div className="dashboard-status">

          <span className="dashboard-status-dot"></span>

          <div>
            <small>
              {t("dataStatus") || "DATA STATUS"}
            </small>

            <strong>
              {t("dataStatusLive") || "LIVE"}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="dashboard-stats">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              className="dashboard-stat-card"
              key={stat.label}
            >

              <div className="dashboard-stat-top">

                <div className="dashboard-stat-icon">
                  <Icon size={21} />
                </div>

                {stat.change && (
                  <span className="dashboard-stat-change">
                    {stat.change}
                  </span>
                )}

              </div>

              <strong className="dashboard-stat-value">
                {stat.value}
              </strong>

              <span className="dashboard-stat-label">
                {stat.label}
              </span>

            </div>
          );

        })}

      </section>


      {/* =====================================================
          AI INTELLIGENCE
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="dashboard-section-label">
              {t("janSetuIntelligence") ||
                "JANSETU INTELLIGENCE"}
            </span>

            <h2>
              {t("intelligence") ||
                "AI Intelligence Overview"}
            </h2>

            <p>
              {t("intelligenceSubtitle") ||
                "Key signals generated from governance datasets"}
            </p>

          </div>

        </div>


        <div className="dashboard-intelligence-grid">

          {intelligenceCards.map((card) => {

            const Icon = card.icon;

            return (
              <div
                className="dashboard-intelligence-card"
                key={card.title}
              >

                <div className="dashboard-card-top">

                  <div className="dashboard-card-icon">
                    <Icon size={23} />
                  </div>

                  <span className="dashboard-card-value">
                    {card.value}
                  </span>

                </div>

                <h3>
                  {card.title}
                </h3>

                <p>
                  {card.description}
                </p>

                <a
                  href={card.path}
                  className="dashboard-card-link"
                >
                  {t("viewAnalysis") ||
                    "View analysis"} →
                </a>

              </div>
            );

          })}

        </div>

      </section>


      {/* =====================================================
          PERFORMANCE PANEL
      ===================================================== */}

      <section className="dashboard-performance">

        <div className="dashboard-performance-content">

          <span className="dashboard-section-label">
            PERFORMANCE
          </span>

          <h2>
            Government Scheme Performance
          </h2>

          <p>
            Overall beneficiary coverage across connected
            government schemes and districts.
          </p>


          <div className="dashboard-progress-wrapper">

            <div className="dashboard-progress-header">

              <span>
                Overall Coverage
              </span>

              <strong>
                {formatPercentage(
                  dashboardData.beneficiaryCoverage
                )}
              </strong>

            </div>


            <div className="dashboard-progress">

              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${Math.min(
                    Math.max(
                      dashboardData.beneficiaryCoverage,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>


        <div className="dashboard-performance-score">

          <TrendingUp size={28} />

          <strong>
            {formatPercentage(
              dashboardData.beneficiaryCoverage
            )}
          </strong>

          <span>
            Average Coverage
          </span>

        </div>

      </section>


      {/* =====================================================
          PRIORITY ATTENTION
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="dashboard-section-label">
              {t("priorityAttention") ||
                "PRIORITY ATTENTION"}
            </span>

            <h2>
              {t("priorityAttention") ||
                "Priority Attention"}
            </h2>

            <p>
              {t("prioritySubtitle") ||
                "AI-generated signals requiring administrative review"}
            </p>

          </div>

        </div>


        <div className="dashboard-priority-card">

          <div className="dashboard-priority-header">

            <span>
              {t("district") || "District"}
            </span>

            <span>
              {t("scheme") || "Scheme"}
            </span>

            <span>
              {t("signal") || "Signal"}
            </span>

            <span>
              Priority
            </span>

          </div>


          {priorityItems.length > 0 ? (

            priorityItems.map((item, index) => (

              <div
                className="dashboard-priority-row"
                key={`${item.district}-${item.scheme}-${index}`}
              >

                <span className="dashboard-district">
                  {item.district}
                </span>

                <span className="dashboard-scheme">
                  {item.scheme}
                </span>

                <span className="dashboard-signal">
                  {item.signal}
                </span>

                <span
                  className={`dashboard-priority-badge ${
                    item.priority === "HIGH"
                      ? "high"
                      : "medium"
                  }`}
                >
                  {item.priority}
                </span>

              </div>

            ))

          ) : (

            <div
              className="dashboard-priority-row"
              style={{
                gridTemplateColumns: "1fr",
              }}
            >
              <span>
                No priority recommendations available.
              </span>
            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          FOOTER INFO
      ===================================================== */}

      <section className="dashboard-footer-info">

        <div>

          <BarChart3 size={20} />

          <div>

            <strong>
              JanSetu AI Intelligence
            </strong>

            <span>
              AI-generated governance insights from
              connected datasets.
            </span>

          </div>

        </div>

        <span className="dashboard-version">
          {t("janSetuVersion") ||
            "JanSetu AI v1.0"}
        </span>

      </section>

    </div>
  );
}

export default Dashboard;

