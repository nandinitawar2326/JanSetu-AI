
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  Map,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  LanguageProvider,
  useLanguage,
} from "./services/LanguageContext";

import Schemes from "./pages/Schemes";
import Anomalies from "./pages/Anomalies";
import Districts from "./pages/Districts";
import Recommendations from "./pages/Recommendations";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";

import "./styles/App.css";


/* =========================================================
   GLOBAL LAYOUT
========================================================= */

function Layout({ children }) {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    {
      path: "/",
      icon: LayoutDashboard,
      key: "overview",
    },
    {
      path: "/dashboard",
      icon: Activity,
      key: "dashboard",
    },
    {
      path: "/schemes",
      icon: BarChart3,
      key: "schemes",
    },
    {
      path: "/districts",
      icon: Map,
      key: "districts",
    },
    {
      path: "/anomalies",
      icon: AlertTriangle,
      key: "anomalies",
    },
    {
      path: "/recommendations",
      icon: Lightbulb,
      key: "recommendations",
    },
  ];

  return (
    <div className="app-shell">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="top-header">

        {/* BRAND */}

        <div className="brand-section">

          <div className="brand-emblem">
            <ShieldCheck size={28} />
          </div>

          <div>
            <div className="brand-name">
              JanSetu AI
            </div>

            <div className="brand-subtitle">
              {t("governanceIntelligence")}
            </div>
          </div>

        </div>


        {/* HEADER RIGHT */}

        <div className="header-right">

          {/* SYSTEM STATUS */}

          <div className="system-status">

            <span className="status-dot"></span>

            <span>
              {t("aiSystemOnline")}
            </span>

          </div>


          {/* LANGUAGE SELECTOR */}

          <div className="language-selector">

            <label htmlFor="language-select">
              {t("language")}
            </label>

            <select
              id="language-select"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
              }}
            >

              <option value="English">
                English
              </option>

              <option value="Marathi">
                मराठी
              </option>

              <option value="Hindi">
                हिन्दी
              </option>

            </select>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="main-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="sidebar">

          <div className="sidebar-title">
            {t("home")}
          </div>


          <nav>

            {navItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >

                  <Icon size={18} />

                  <span>
                    {t(item.key)}
                  </span>

                </NavLink>
              );

            })}

          </nav>


          {/* =================================================
              SIDEBAR BOTTOM
          ================================================= */}

          <div className="sidebar-bottom">

            <div className="data-status">

              <span className="status-dot"></span>

              <div>

                <small>
                  {t("dataStatus")}
                </small>

                <strong>
                  {t("dataConnected")}
                </strong>

              </div>

            </div>


            <div className="version">
              {t("janSetuVersion")}
            </div>

          </div>

        </aside>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="content">
          {children}
        </main>

      </div>

    </div>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (

    <LanguageProvider>

      <BrowserRouter>

        <Routes>

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <Route
            path="/"
            element={
              <Layout>
                <Overview />
              </Layout>
            }
          />


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />


          {/* =================================================
              SCHEMES
          ================================================= */}

          <Route
            path="/schemes"
            element={
              <Layout>
                <Schemes />
              </Layout>
            }
          />


          {/* =================================================
              ANOMALIES
          ================================================= */}

          <Route
            path="/anomalies"
            element={
              <Layout>
                <Anomalies />
              </Layout>
            }
          />


          {/* =================================================
              DISTRICTS
          ================================================= */}

          <Route
            path="/districts"
            element={
              <Layout>
                <Districts />
              </Layout>
            }
          />


          {/* =================================================
              RECOMMENDATIONS
          ================================================= */}

          <Route
            path="/recommendations"
            element={
              <Layout>
                <Recommendations />
              </Layout>
            }
          />

        </Routes>

      </BrowserRouter>

    </LanguageProvider>

  );
}

