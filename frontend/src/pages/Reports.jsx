import { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================
  // FETCH REPORTS
  // =====================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("User not logged in.");
        return;
      }

      const user = JSON.parse(storedUser);

      const response = await fetch(
        `http://localhost:5000/reports/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reports"
        );
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error("Reports error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DOWNLOAD PDF REPORT
  // =====================================

  const downloadReport = async (documentId) => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("User not logged in.");
        return;
      }

      const user = JSON.parse(storedUser);

      setDownloadingId(documentId);

      const response = await fetch(
        `http://localhost:5000/reports/${user.id}/${documentId}/pdf`
      );

      if (!response.ok) {
        let message = "Failed to download report.";

        try {
          const data = await response.json();

          if (data.message) {
            message = data.message;
          }
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        `Compliance_Report_${documentId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Download report error:",
        error
      );

      alert(
        error.message ||
        "Unable to download compliance report."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-container">

          <h1>Compliance Reports</h1>

          <p>
            Loading your compliance reports...
          </p>

        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="reports-page">

        <div className="reports-container">

          <h1>Compliance Reports</h1>

          <div className="error-box">
            ❌ {error}
          </div>

          <button
            className="new-report-button"
            onClick={fetchReports}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================
  // NO REPORTS
  // =====================================

  if (reports.length === 0) {
    return (
      <div className="reports-page">

        <div className="reports-container">

          <div className="reports-header">

            <div>

              <h1>
                Compliance Reports
              </h1>

              <p>
                Review your document compliance
                analysis and recommendations.
              </p>

            </div>

          </div>

          <div className="empty-report">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              No Compliance Reports Yet
            </h2>

            <p>
              Upload a PDF or DOCX document to
              generate your compliance report.
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================
  // REPORTS
  // =====================================

  return (
    <div className="reports-page">

      <div className="reports-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="reports-header">

          <div>

            <h1>
              Compliance Reports
            </h1>

            <p>
              AI-powered compliance analysis
              of your uploaded documents.
            </p>

          </div>

          <button
            className="new-report-button"
            onClick={() => {
              window.location.href = "/upload";
            }}
          >
            + Analyze New Document
          </button>

        </div>

        {/* =================================
            REPORT LIST
        ================================= */}

        {reports.map((report) => {

          const findings =
            report.findings || [];

          const highIssues =
            findings.filter(
              (item) =>
                item.severity === "High"
            ).length;

          const mediumIssues =
            findings.filter(
              (item) =>
                item.severity === "Medium"
            ).length;

          const lowIssues =
            findings.filter(
              (item) =>
                item.severity === "Low"
            ).length;

          const score =
            Number(report.risk_score) || 0;

          const riskLevel =
            report.risk_level ||
            (
              score < 50
                ? "High"
                : score < 75
                ? "Medium"
                : "Low"
            );

          return (

            <div
              className="report-card"
              key={report.id}
            >

              {/* =================================
                  DOCUMENT
              ================================= */}

              <div className="report-document">

                <div className="document-icon">
                  📄
                </div>

                <div className="document-info">

                  <strong>
                    {report.original_name}
                  </strong>

                  <span>
                    Document successfully analyzed
                  </span>

                </div>

                <span
                  className={`risk-badge ${riskLevel.toLowerCase()}`}
                >
                  {riskLevel} Risk
                </span>

              </div>

              {/* =================================
                  DOWNLOAD BUTTON
              ================================= */}

              <div className="report-actions">

                <button
                  className="download-report-button"
                  onClick={() =>
                    downloadReport(report.id)
                  }
                  disabled={
                    downloadingId === report.id
                  }
                >

                  {downloadingId === report.id
                    ? "⏳ Generating PDF..."
                    : "📥 Download PDF"}

                </button>

              </div>

              {/* =================================
                  SCORE
              ================================= */}

              <div className="score-card">

                <div className="score-circle">

                  <span>
                    {score}%
                  </span>

                  <small>
                    Score
                  </small>

                </div>

                <div className="score-info">

                  <h2>
                    Overall Compliance Score
                  </h2>

                  <p>
                    This score represents the
                    compliance status detected
                    from the uploaded document.
                  </p>

                </div>

              </div>

              {/* =================================
                  STATISTICS
              ================================= */}

              <div className="report-stats">

                {/* Total */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🔎
                  </div>

                  <h3>
                    {findings.length}
                  </h3>

                  <p>
                    Total Findings
                  </p>

                </div>

                {/* High */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🔴
                  </div>

                  <h3>
                    {highIssues}
                  </h3>

                  <p>
                    High Risk
                  </p>

                </div>

                {/* Medium */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🟠
                  </div>

                  <h3>
                    {mediumIssues}
                  </h3>

                  <p>
                    Medium Risk
                  </p>

                </div>

                {/* Low */}

                <div className="stat-card">

                  <div className="stat-icon">
                    🟢
                  </div>

                  <h3>
                    {lowIssues}
                  </h3>

                  <p>
                    Low Risk
                  </p>

                </div>

              </div>

              {/* =================================
                  FINDINGS
              ================================= */}

              <div className="findings-section">

                <div className="section-title">

                  <div>

                    <h2>
                      Compliance Findings
                    </h2>

                    <p>
                      Issues identified during
                      document analysis.
                    </p>

                  </div>

                </div>

                {findings.length === 0 ? (

                  <div className="success-box">

                    <span>
                      ✅
                    </span>

                    <div>

                      <strong>
                        No compliance issues detected
                      </strong>

                      <p>
                        The uploaded document passed
                        the current compliance checks.
                      </p>

                    </div>

                  </div>

                ) : (

                  findings.map(
                    (finding, index) => (

                      <div
                        className="finding-card"
                        key={index}
                      >

                        <div className="finding-number">
                          {index + 1}
                        </div>

                        <div className="finding-content">

                          <div className="finding-top">

                            <h3>
                              {finding.issue}
                            </h3>

                            <span
                              className={`severity ${
                                finding.severity.toLowerCase()
                              }`}
                            >
                              {finding.severity}
                            </span>

                          </div>

                          <div className="recommendation">

                            <strong>
                              💡 Recommendation
                            </strong>

                            <p>
                              {finding.recommendation}
                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

              {/* =================================
                  ANALYSIS INFORMATION
              ================================= */}

              <div className="analysis-info">

                <h2>
                  Document Analysis Information
                </h2>

                <div className="analysis-grid">

                  {/* Document */}

                  <div>

                    <span>
                      Document
                    </span>

                    <strong>
                      {report.original_name}
                    </strong>

                  </div>

                  {/* Score */}

                  <div>

                    <span>
                      Risk Score
                    </span>

                    <strong>
                      {score}%
                    </strong>

                  </div>

                  {/* Risk */}

                  <div>

                    <span>
                      Risk Level
                    </span>

                    <strong>
                      {riskLevel}
                    </strong>

                  </div>

                  {/* Status */}

                  <div>

                    <span>
                      Analysis Status
                    </span>

                    <strong>
                      {report.analysis_status} ✓
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default Reports;