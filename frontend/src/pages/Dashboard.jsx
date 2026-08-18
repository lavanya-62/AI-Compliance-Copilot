import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!userId) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/reports/dashboard/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      console.log("Dashboard data:", result);

      setData(result);
    } catch (error) {
      console.error("Dashboard error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // ==============================
  // NO DATA
  // ==============================

  if (!data || !data.latestDocument) {
    return (
      <div className="dashboard-page">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your AI Compliance Dashboard</p>
          </div>

          <div className="welcome">
            Welcome, Lavanya
          </div>
        </div>

        {/* Overview */}
        <h2>AI Compliance Overview</h2>

        <div className="stats-grid">

          <div className="stat-card">
            <p>Compliance Score</p>
            <h3>0%</h3>
            <span>No document analyzed yet</span>
          </div>

          <div className="stat-card">
            <p>Risk Level</p>
            <h3>No Data</h3>
            <span>Upload a document to analyze</span>
          </div>

          <div className="stat-card">
            <p>Documents Checked</p>
            <h3>0</h3>
            <span>AI analyzed documents</span>
          </div>

          <div className="stat-card">
            <p>Issues Found</p>
            <h3>0</h3>
            <span>No issues detected</span>
          </div>

        </div>

        {/* Risk Breakdown */}
        <div className="dashboard-section">

          <h2>Risk Breakdown</h2>

          <div className="risk-grid">

            <div className="risk-card high">
             <strong>
              🔴High-Severity Issues: {highRisk}
              </strong>
              <p>
                Individual findings classified as high severity.
                </p>
            </div>

            <div className="risk-card medium">
            <strong>
               🟠 Medium-Severity Issues: {mediumRisk}
               </strong>
               <p>
                Individual findings classified as medium severity.
                </p>
            </div>

            <div className="risk-card low">
              <strong>
                🟢 Low-Severity Issues: {lowRisk}
                </strong>
                <p>
                  Individual findings classified as low severity.
                  </p>
            </div>

          </div>

        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">

          <h2>Recent Compliance Activity</h2>

          <div className="activity">
            <strong>📄 No documents analyzed</strong>

            <p>
              Upload a compliance document to get started.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // ==============================
  // LATEST DOCUMENT DATA
  // ==============================

  const document = data.latestDocument;

  const score = Number(data.complianceScore) || 0;

  const documentsChecked =
    Number(data.documentsChecked) || 0;

  const totalFindings =
    Number(data.totalFindings) || 0;

  const highRisk =
    Number(data.highRisk) || 0;

  const mediumRisk =
    Number(data.mediumRisk) || 0;

  const lowRisk =
    Number(data.lowRisk) || 0;

  const riskLevel =
    data.riskLevel || "No Data";

  // ==============================
  // DASHBOARD
  // ==============================

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome to your AI Compliance Dashboard
          </p>
        </div>

        <div className="welcome">
          Welcome, Lavanya
        </div>

      </div>


      {/* ================= OVERVIEW ================= */}

      <h2>AI Compliance Overview</h2>

      <div className="stats-grid">

        {/* Compliance Score */}

        <div className="stat-card">

          <p>Compliance Score</p>

          <h3>
            {score}%
          </h3>

          <span>
            Based on latest document
          </span>

        </div>


        {/* Risk Level */}

        <div className="stat-card">

          <p>Risk Level</p>

          <h3 className="medium">
            {riskLevel}
          </h3>

          <span>
            Current compliance risk
          </span>

        </div>


        {/* Documents Checked */}

        <div className="stat-card">

          <p>Documents Checked</p>

          <h3>
            {documentsChecked}
          </h3>

          <span>
            AI analyzed documents
          </span>

        </div>


        {/* Issues Found */}

        <div className="stat-card">

          <p>Issues Found</p>

          <h3>
            {totalFindings}
          </h3>

          <span>
            Needs attention
          </span>

        </div>

      </div>


      {/* ================= RISK BREAKDOWN ================= */}

      <div className="dashboard-section">

        <h2>Risk Breakdown</h2>

        <div className="risk-grid">

          {/* High Risk */}

          <div className="risk-card high">

            <strong>
              🔴 High Risk: {highRisk}
            </strong>

            <p>
              High-severity compliance issues detected.
            </p>

          </div>


          {/* Medium Risk */}

          <div className="risk-card medium">

            <strong>
              🟠 Medium Risk: {mediumRisk}
            </strong>

            <p>
              Medium-severity issues that need attention.
            </p>

          </div>


          {/* Low Risk */}

          <div className="risk-card low">

            <strong>
              🟢 Low Risk: {lowRisk}
            </strong>

            <p>
              Low-severity compliance issues detected.
            </p>

          </div>

        </div>

      </div>


      {/* ================= RECENT ACTIVITY ================= */}

      <div className="dashboard-section">

        <h2>Recent Compliance Activity</h2>


        {/* Document */}

        <div className="activity success">

          <strong>
            ✓ Document Analyzed
          </strong>

          <p>
            {document.name} was successfully analyzed.
          </p>

        </div>


        {/* Score */}

        <div className="activity success">

          <strong>
            📊 Compliance Score: {score}%
          </strong>

          <p>
            Current compliance level is{" "}
            {riskLevel.toLowerCase()} risk.
          </p>

        </div>


        {/* Findings */}

        {data.findings &&
          data.findings.length > 0 && (
            <>

              {data.findings.map((finding, index) => (

                <div
                  className="activity warning"
                  key={index}
                >

                  <strong>
                    ⚠ {finding.issue}
                  </strong>

                  <p>
                    {finding.recommendation}
                  </p>

                </div>

              ))}

            </>
          )}

      </div>

    </div>
  );
}

export default Dashboard;