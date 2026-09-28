import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  Search,
  RefreshCw,
} from "lucide-react";

import { getAnomalies } from "../services/api";
import { useLanguage } from "../services/LanguageContext";

import "../styles/Anomalies.css";

function Anomalies() {
  const { t } = useLanguage();

  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnomalies();

      setAnomalies(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Anomalies loading error:",
        err
      );

      setError(
        t("unableToLoadAnomalies")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnomalies();
  }, []);

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((item) => {

      const matchesSearch =
        item.scheme_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.district
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" ||
        item.severity === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [anomalies, search, filter]);

  const totalSignals =
    anomalies.length;

  const highSeverity =
    anomalies.filter(
      (item) =>
        item.severity === "HIGH"
    ).length;

  const mediumSeverity =
    anomalies.filter(
      (item) =>
        item.severity === "MEDIUM"
    ).length;

  const averagePerformance =
    anomalies.length > 0
      ? (
          anomalies.reduce(
            (sum, item) =>
              sum +
              Number(
                item.performance_score || 0
              ),
            0
          ) / anomalies.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="anomalies-page">

      {/* HEADER */}
      <div className="anomalies-header">

        <div>

          <div className="anomalies-breadcrumb">
            {t("home")} / {t("intelligence")} /{" "}
            {t("anomalies")}
          </div>

          <h1>
            {t("aiAnomalyDetection")}
          </h1>

          <p>
            {t("anomalyDescription")}
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadAnomalies}
          disabled={loading}
        >
          <RefreshCw size={17} />

          {t("refreshAnalysis")}
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <section className="anomaly-summary">

        <div className="anomaly-card">

          <div className="anomaly-card-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>
              {t("totalSignals")}
            </span>

            <strong>
              {totalSignals}
            </strong>
          </div>

        </div>


        <div className="anomaly-card high">

          <div className="anomaly-card-icon">
            <ShieldAlert size={22} />
          </div>

          <div>
            <span>
              {t("highSeverity")}
            </span>

            <strong>
              {highSeverity}
            </strong>
          </div>

        </div>


        <div className="anomaly-card medium">

          <div className="anomaly-card-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>
              {t("mediumSeverity")}
            </span>

            <strong>
              {mediumSeverity}
            </strong>
          </div>

        </div>


        <div className="anomaly-card">

          <div className="anomaly-card-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>
              {t("averagePerformance")}
            </span>

            <strong>
              {averagePerformance}
            </strong>
          </div>

        </div>

      </section>


      {/* FILTER BAR */}
      <section className="anomaly-controls">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder={t(
              "searchSchemeDistrict"
            )}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="filter-buttons">

          <button
            className={
              filter === "ALL"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("ALL")
            }
          >
            {t("all")}
          </button>

          <button
            className={
              filter === "HIGH"
                ? "active high-filter"
                : ""
            }
            onClick={() =>
              setFilter("HIGH")
            }
          >
            {t("high")}
          </button>

          <button
            className={
              filter === "MEDIUM"
                ? "active medium-filter"
                : ""
            }
            onClick={() =>
              setFilter("MEDIUM")
            }
          >
            {t("medium")}
          </button>

        </div>

      </section>


      {/* CONTENT */}
      <section className="anomaly-content">

        <div className="section-heading">

          <div>
            <h2>
              {t("detectedAnomalies")}
            </h2>

            <p>
              {filteredAnomalies.length}{" "}
              {t("signalsRequiringReview")}
            </p>
          </div>

        </div>


        {loading && (
          <div className="anomaly-state">
            {t("loadingAnomalies")}
          </div>
        )}


        {error && (
          <div className="anomaly-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}


        {!loading &&
          !error &&
          filteredAnomalies.length === 0 && (
            <div className="anomaly-state">
              {t("noAnomaliesFound")}
            </div>
          )}


        {!loading &&
          !error &&
          filteredAnomalies.length > 0 && (

            <div className="anomaly-table-wrapper">

              <table className="anomaly-table">

                <thead>
                  <tr>

                    <th>
                      {t("scheme")}
                    </th>

                    <th>
                      {t("district")}
                    </th>

                    <th>
                      {t("severity")}
                    </th>

                    <th>
                      {t("signals")}
                    </th>

                    <th>
                      {t("performance")}
                    </th>

                    <th>
                      {t("detectionReasons")}
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {filteredAnomalies.map(
                    (item, index) => {

                      const severity =
                        item.severity
                          ?.toUpperCase();

                      return (
                        <tr
                          key={`${item.scheme_id}-${item.district_id}-${index}`}
                        >

                          <td>

                            <div className="scheme-name">
                              {item.scheme_name}
                            </div>

                            <small>
                              {item.scheme_id}
                              {" · "}
                              {item.department_id}
                            </small>

                          </td>


                          <td>

                            <strong>
                              {item.district}
                            </strong>

                            <small>
                              {item.district_id}
                            </small>

                          </td>


                          <td>

                            <span
                              className={`severity-badge ${severity?.toLowerCase()}`}
                            >
                              {severity ===
                              "HIGH"
                                ? t("high")
                                : t("medium")}
                            </span>

                          </td>


                          <td>

                            <strong className="signal-number">
                              {item.signal_count}
                            </strong>

                          </td>


                          <td>

                            <strong className="performance-number">
                              {Number(
                                item.performance_score ||
                                  0
                              ).toFixed(2)}
                            </strong>

                          </td>


                          <td>

                            <div className="reasons">

                              {Array.isArray(
                                item.reasons
                              ) &&
                                item.reasons.map(
                                  (
                                    reason,
                                    reasonIndex
                                  ) => (
                                    <div
                                      key={
                                        reasonIndex
                                      }
                                    >
                                      {reason}
                                    </div>
                                  )
                                )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>

    </div>
  );
}

export default Anomalies;