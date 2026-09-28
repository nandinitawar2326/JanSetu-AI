

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Users,
  Building2,
  Activity,
  Search,
  RefreshCw,
} from "lucide-react";

import { getGeographicGaps } from "../services/api";
import "../styles/Districts.css";

function Districts() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadDistricts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGeographicGaps();

      console.log("DISTRICTS DATA:", data);

      if (!Array.isArray(data)) {
        throw new Error("District API did not return an array.");
      }

      setDistricts(data);
    } catch (err) {
      console.error("District loading error:", err);

      if (err.response) {
        setError(
          `Unable to load district data. Server returned ${err.response.status}.`
        );
      } else if (err.request) {
        setError("Unable to connect to JanSetu AI backend.");
      } else {
        setError(`Unable to load district data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistricts();
  }, []);

  const filteredDistricts = districts.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.district?.toLowerCase().includes(query) ||
      item.state?.toLowerCase().includes(query) ||
      item.district_id?.toLowerCase().includes(query)
    );
  });

  const getGapClass = (level) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "gap-high";

      case "MEDIUM":
        return "gap-medium";

      case "LOW":
        return "gap-low";

      default:
        return "gap-low";
    }
  };

  const totalDistricts = districts.length;

  const averageCoverage =
    districts.length > 0
      ? districts.reduce(
          (sum, item) => sum + Number(item.average_coverage || 0),
          0
        ) / districts.length
      : 0;

  const averageInfrastructure =
    districts.length > 0
      ? districts.reduce(
          (sum, item) =>
            sum + Number(item.infrastructure_index || 0),
          0
        ) / districts.length
      : 0;

  const highGapDistricts = districts.filter(
    (item) => item.gap_level?.toUpperCase() === "HIGH"
  ).length;

  return (
    <div className="districts-page">

      {/* HEADER */}
      <div className="districts-header">

        <div>
          <div className="districts-breadcrumb">
            HOME / DISTRICTS
          </div>

          <h1>District Intelligence</h1>

          <p>
            AI-powered analysis of district-level governance
            coverage, infrastructure and service delivery gaps.
          </p>
        </div>

        <button
          type="button"
          className="district-refresh-button"
          onClick={loadDistricts}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "refresh-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* SUMMARY CARDS */}
      {!loading && !error && (
        <section className="district-summary-grid">

          <div className="district-summary-card">

            <div className="summary-icon">
              <MapPin size={22} />
            </div>

            <div>
              <span>Total Districts</span>
              <strong>{totalDistricts}</strong>
            </div>

          </div>

          <div className="district-summary-card">

            <div className="summary-icon">
              <Activity size={22} />
            </div>

            <div>
              <span>Average Coverage</span>
              <strong>
                {averageCoverage.toFixed(2)}%
              </strong>
            </div>

          </div>

          <div className="district-summary-card">

            <div className="summary-icon">
              <Building2 size={22} />
            </div>

            <div>
              <span>Infrastructure Index</span>
              <strong>
                {averageInfrastructure.toFixed(1)}
              </strong>
            </div>

          </div>

          <div className="district-summary-card">

            <div className="summary-icon">
              <Users size={22} />
            </div>

            <div>
              <span>High Gap Districts</span>
              <strong>
                {highGapDistricts}
              </strong>
            </div>

          </div>

        </section>
      )}

      {/* SEARCH */}
      {!loading && !error && (
        <div className="district-toolbar">

          <div className="district-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="district-count">
            Showing {filteredDistricts.length} of{" "}
            {districts.length} districts
          </div>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="district-state">
          Loading district intelligence...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="district-error">

          <strong>{error}</strong>

          <button
            type="button"
            onClick={loadDistricts}
          >
            <RefreshCw size={16} />
            Retry
          </button>

        </div>
      )}

      {/* TABLE */}
      {!loading &&
        !error &&
        filteredDistricts.length > 0 && (
          <div className="district-table-container">

            <table className="district-table">

              <thead>
                <tr>
                  <th>District</th>
                  <th>Population</th>
                  <th>Rural Population</th>
                  <th>Infrastructure</th>
                  <th>Avg Coverage</th>
                  <th>Schemes Below 50%</th>
                  <th>Gap Level</th>
                </tr>
              </thead>

              <tbody>

                {filteredDistricts.map((item) => {

                  const coverage = Number(
                    item.average_coverage || 0
                  );

                  const infrastructure = Number(
                    item.infrastructure_index || 0
                  );

                  return (
                    <tr key={item.district_id}>

                      {/* DISTRICT */}
                      <td>
                        <div className="district-name">

                          <div className="district-map-icon">
                            <MapPin size={17} />
                          </div>

                          <div>
                            <strong>
                              {item.district}
                            </strong>

                            <small>
                              {item.district_id} ·{" "}
                              {item.state}
                            </small>
                          </div>

                        </div>
                      </td>

                      {/* POPULATION */}
                      <td>
                        {Number(
                          item.population || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* RURAL */}
                      <td>
                        {Number(
                          item.rural_population || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* INFRASTRUCTURE */}
                      <td>

                        <div className="metric-cell">

                          <strong>
                            {infrastructure.toFixed(0)}
                          </strong>

                          <div className="metric-bar">
                            <div
                              className="metric-fill infrastructure-fill"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    infrastructure,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      {/* COVERAGE */}
                      <td>

                        <div className="metric-cell">

                          <strong>
                            {coverage.toFixed(2)}%
                          </strong>

                          <div className="metric-bar">
                            <div
                              className="metric-fill coverage-fill-district"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    coverage,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      {/* SCHEMES BELOW 50 */}
                      <td>

                        <span
                          className={
                            Number(
                              item.schemes_below_50 || 0
                            ) > 0
                              ? "scheme-warning"
                              : "scheme-normal"
                          }
                        >
                          {item.schemes_below_50 || 0}
                        </span>

                        <small className="scheme-total">
                          {" "}
                          / {item.schemes_analyzed || 0}
                        </small>

                      </td>

                      {/* GAP */}
                      <td>

                        <span
                          className={`gap-badge ${getGapClass(
                            item.gap_level
                          )}`}
                        >
                          {item.gap_level || "LOW"}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      {/* NO RESULTS */}
      {!loading &&
        !error &&
        filteredDistricts.length === 0 && (
          <div className="district-state">
            No districts found.
          </div>
        )}

    </div>
  );
}

export default Districts;

