
import React, { useCallback, useEffect, useState } from "react";
import "../styles/Schemes.css";
import { getCoverage } from "../services/api";
import { useLanguage } from "../services/LanguageContext";

function Schemes() {
  const { t } = useLanguage();

  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD COVERAGE DATA
  ========================================================= */

  const loadCoverage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCoverage();

      console.log("COVERAGE DATA:", data);

      if (!Array.isArray(data)) {
        throw new Error("Coverage API did not return an array.");
      }

      setCoverage(data);
    } catch (err) {
      console.error("Coverage loading error:", err);

      if (err.response) {
        setError(
          `${t("unableToLoadCoverage")} ${t("serverReturned")} ${err.response.status}.`
        );
      } else if (err.request) {
        setError(t("backendConnectionError"));
      } else {
        setError(
          `${t("unableToLoadCoverage")} ${
            err.message || t("error")
          }`
        );
      }

      setCoverage([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCoverage();
  }, [loadCoverage]);

  /* =========================================================
     STATUS CALCULATION
  ========================================================= */

  const getStatus = (percentage) => {
    const value = Number(percentage);

    if (value < 50) {
      return {
        text: t("critical"),
        className: "critical",
      };
    }

    if (value < 70) {
      return {
        text: t("needsAttention"),
        className: "needs-attention",
      };
    }

    return {
      text: t("good"),
      className: "good",
    };
  };

  /* =========================================================
     NUMBER FORMATTER
  ========================================================= */

  const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-IN");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="schemes-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="schemes-header">

        <div>

          <div className="schemes-breadcrumb">
            {t("home")} / {t("schemes")}
          </div>

          <h1>
            {t("governmentSchemes")}
          </h1>

          <p>
            {t("schemesDescription")}
          </p>

        </div>

        <div className="scheme-summary">

          <span>
            {t("coverageRecords")}
          </span>

          <strong>
            {coverage.length}
          </strong>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="schemes-state">
          {t("loadingCoverage")}
        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (

        <div className="schemes-error">

          <strong>
            {error}
          </strong>

          <button
            type="button"
            className="retry-button"
            onClick={loadCoverage}
          >
            {t("retry")}
          </button>

        </div>

      )}


      {/* =====================================================
          TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        coverage.length > 0 && (

          <div className="schemes-table-container">

            <table className="schemes-table">

              <thead>

                <tr>

                  <th>
                    {t("scheme")}
                  </th>

                  <th>
                    {t("district")}
                  </th>

                  <th>
                    {t("targetBeneficiaries")}
                  </th>

                  <th>
                    {t("actualBeneficiaries")}
                  </th>

                  <th>
                    {t("coverage")}
                  </th>

                  <th>
                    {t("status")}
                  </th>

                </tr>

              </thead>


              <tbody>

                {coverage.map((item, index) => {

                  const percentage = Number(
                    item.coverage_percentage ?? 0
                  );

                  const safePercentage =
                    Number.isFinite(percentage)
                      ? percentage
                      : 0;

                  const barWidth = Math.min(
                    Math.max(safePercentage, 0),
                    100
                  );

                  const status =
                    getStatus(safePercentage);

                  return (

                    <tr
                      key={`${item.scheme_id || "scheme"}-${
                        item.district_id || "district"
                      }-${index}`}
                    >

                      {/* SCHEME */}

                      <td>

                        <strong>
                          {item.scheme_name || "—"}
                        </strong>

                      </td>


                      {/* DISTRICT */}

                      <td>
                        {item.district || "—"}
                      </td>


                      {/* TARGET BENEFICIARIES */}

                      <td>
                        {formatNumber(
                          item.target_beneficiaries
                        )}
                      </td>


                      {/* ACTUAL BENEFICIARIES */}

                      <td>
                        {formatNumber(
                          item.actual_beneficiaries
                        )}
                      </td>


                      {/* COVERAGE */}

                      <td>

                        <div className="coverage-cell">

                          <strong>
                            {safePercentage.toFixed(2)}%
                          </strong>

                          <div className="coverage-bar">

                            <div
                              className="coverage-fill"
                              style={{
                                width: `${barWidth}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`coverage-status ${status.className}`}
                        >
                          {status.text}
                        </span>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        coverage.length === 0 && (

          <div className="schemes-state">

            {t("noData")}

          </div>

        )}

    </div>
  );
}

export default Schemes;

