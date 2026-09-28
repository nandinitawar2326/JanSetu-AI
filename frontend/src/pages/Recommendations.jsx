import React, { useEffect, useState } from "react";
import {
  Lightbulb,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { getRecommendations } from "../services/api";
import "../styles/Recommendations.css";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecommendations();

      console.log("RECOMMENDATIONS DATA:", data);

      if (!Array.isArray(data)) {
        throw new Error(
          "Recommendations API did not return an array."
        );
      }

      setRecommendations(data);
    } catch (err) {
      console.error("Recommendations loading error:", err);

      if (err.response) {
        setError(
          `Unable to load recommendations. Server returned ${err.response.status}.`
        );
      } else if (err.request) {
        setError(
          "Unable to connect to JanSetu AI backend."
        );
      } else {
        setError(
          `Unable to load recommendations: ${err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const getPriorityClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "priority-high";

      case "MEDIUM":
        return "priority-medium";

      case "LOW":
        return "priority-low";

      default:
        return "priority-medium";
    }
  };

  const getTypeClass = (type) => {
    return type?.toUpperCase() === "GEOGRAPHIC"
      ? "recommendation-geographic"
      : "recommendation-scheme";
  };

  const highPriority = recommendations.filter(
    (item) =>
      item.priority?.toUpperCase() === "HIGH"
  ).length;

  const mediumPriority = recommendations.filter(
    (item) =>
      item.priority?.toUpperCase() === "MEDIUM"
  ).length;

  const schemeRecommendations = recommendations.filter(
    (item) =>
      item.type?.toUpperCase() === "SCHEME"
  ).length;

  const geographicRecommendations =
    recommendations.filter(
      (item) =>
        item.type?.toUpperCase() === "GEOGRAPHIC"
    ).length;

  return (
    <div className="recommendations-page">

      {/* HEADER */}
      <div className="recommendations-header">

        <div>
          <div className="recommendations-breadcrumb">
            HOME / RECOMMENDATIONS
          </div>

          <h1>AI Recommendations</h1>

          <p>
            AI-generated actions based on scheme performance,
            beneficiary coverage, resource utilization and
            geographic gaps.
          </p>
        </div>

        <button
          type="button"
          className="recommendations-refresh"
          onClick={loadRecommendations}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "refresh-spinning" : ""}
          />

          Refresh
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="recommendations-state">
          <RefreshCw
            size={22}
            className="refresh-spinning"
          />

          <span>
            Loading AI recommendations...
          </span>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="recommendations-error">

          <div className="recommendations-error-content">
            <AlertTriangle size={22} />

            <strong>{error}</strong>
          </div>

          <button
            type="button"
            onClick={loadRecommendations}
            className="recommendations-retry"
          >
            Retry
          </button>

        </div>
      )}

      {/* CONTENT */}
      {!loading &&
        !error &&
        recommendations.length > 0 && (
          <>

            {/* SUMMARY */}
            <section className="recommendation-metrics">

              <div className="recommendation-metric-card">
                <div className="metric-icon">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <span>Total Recommendations</span>
                  <strong>
                    {recommendations.length}
                  </strong>
                </div>
              </div>

              <div className="recommendation-metric-card high">
                <div className="metric-icon">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <span>High Priority</span>
                  <strong>
                    {highPriority}
                  </strong>
                </div>
              </div>

              <div className="recommendation-metric-card medium">
                <div className="metric-icon">
                  <ActivityIcon />
                </div>

                <div>
                  <span>Medium Priority</span>
                  <strong>
                    {mediumPriority}
                  </strong>
                </div>
              </div>

              <div className="recommendation-metric-card">
                <div className="metric-icon">
                  <MapPin size={21} />
                </div>

                <div>
                  <span>Geographic</span>
                  <strong>
                    {geographicRecommendations}
                  </strong>
                </div>
              </div>

            </section>

            {/* SECTION TITLE */}
            <div className="recommendations-section-heading">

              <div>
                <h2>
                  Recommended Actions
                </h2>

                <p>
                  Administrative actions generated from
                  detected governance signals.
                </p>
              </div>

              <span className="recommendation-count">
                {schemeRecommendations} scheme
                {schemeRecommendations !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            {/* RECOMMENDATION CARDS */}
            <section className="recommendations-grid">

              {recommendations.map(
                (item, index) => {

                  const priorityClass =
                    getPriorityClass(
                      item.priority
                    );

                  const typeClass =
                    getTypeClass(item.type);

                  return (
                    <article
                      className={`recommendation-card ${typeClass}`}
                      key={`${item.district}-${item.scheme_name}-${index}`}
                    >

                      {/* CARD HEADER */}
                      <div className="recommendation-card-header">

                        <div className="recommendation-title-area">

                          <div className="recommendation-icon">
                            {item.type?.toUpperCase() ===
                            "GEOGRAPHIC" ? (
                              <MapPin size={20} />
                            ) : (
                              <Lightbulb size={20} />
                            )}
                          </div>

                          <div>
                            <span className="recommendation-type">
                              {item.type ===
                              "GEOGRAPHIC"
                                ? "GEOGRAPHIC"
                                : "SCHEME"}
                            </span>

                            <h3>
                              {item.scheme_name}
                            </h3>
                          </div>

                        </div>

                        <span
                          className={`priority-badge ${priorityClass}`}
                        >
                          {item.priority}
                        </span>

                      </div>

                      {/* DISTRICT */}
                      <div className="recommendation-district">

                        <MapPin size={15} />

                        <span>
                          {item.district}
                        </span>

                      </div>

                      {/* ACTIONS */}
                      <div className="recommendation-block">

                        <div className="recommendation-block-title">
                          <CheckCircle2 size={16} />

                          <span>
                            Recommended Actions
                          </span>
                        </div>

                        <ul>
                          {(item.actions || []).map(
                            (action, actionIndex) => (
                              <li
                                key={actionIndex}
                              >
                                {action}
                              </li>
                            )
                          )}
                        </ul>

                      </div>

                      {/* EVIDENCE */}
                      <div className="recommendation-block evidence">

                        <div className="recommendation-block-title">
                          <AlertTriangle size={16} />

                          <span>
                            Supporting Evidence
                          </span>
                        </div>

                        <ul>
                          {(item.evidence || []).map(
                            (evidence, evidenceIndex) => (
                              <li
                                key={evidenceIndex}
                              >
                                {evidence}
                              </li>
                            )
                          )}
                        </ul>

                      </div>

                    </article>
                  );
                }
              )}

            </section>

          </>
        )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        recommendations.length === 0 && (
          <div className="recommendations-state empty">
            <Lightbulb size={24} />

            <strong>
              No recommendations available.
            </strong>

            <span>
              The AI engine has not generated any
              recommendations from the current dataset.
            </span>
          </div>
        )}

    </div>
  );
}

/*
 * Small icon component used for the
 * Medium Priority metric.
 */
function ActivityIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  );
}

export default Recommendations;