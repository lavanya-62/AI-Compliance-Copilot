import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!userId) {
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/reports/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load compliance history");
      }

      const data = await response.json();

      setReports(data.reports || []);
    } catch (error) {
      console.error("History error:", error);
      setError("Unable to load compliance history.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (documentId) => {
    window.open(
      `http://localhost:5000/reports/${userId}/${documentId}/pdf`,
      "_blank"
    );
  };

  const getRiskClass = (risk) => {
    if (risk === "High") return "history-risk high";
    if (risk === "Medium") return "history-risk medium";
    return "history-risk low";
  };

  if (loading) {
    return (
      <div className="history-page">
        <h1>Compliance History</h1>
        <p>Loading your compliance history...</p>
      </div>
    );
  }

  return (
    <div className="history-page">

      <div className="history-header">
        <div>
          <h1>Compliance History</h1>
          <p>
            View your previously analyzed compliance documents.
          </p>
        </div>

        <button
          className="new-analysis-btn"
          onClick={() => navigate("/upload")}
        >
          + Analyze New Document
        </button>
      </div>

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      {!error && reports.length === 0 && (
        <div className="empty-history">
          <div className="empty-icon">📄</div>

          <h2>No Compliance History</h2>

          <p>
            You have not analyzed any compliance documents yet.
          </p>

          <button
            className="new-analysis-btn"
            onClick={() => navigate("/upload")}
          >
            Upload Your First Document
          </button>
        </div>
      )}

      {reports.length > 0 && (
        <div className="history-list">

          {reports.map((report) => (

            <div
              className="history-card"
              key={report.id}
            >

              <div className="history-document">

                <div className="document-icon">
                  📄
                </div>

                <div>
                  <h2>
                    {report.original_name}
                  </h2>

                  <p>
                    Document successfully analyzed
                  </p>

                  <small>
                    {report.uploaded_at
                      ? new Date(
                          report.uploaded_at
                        ).toLocaleString()
                      : "Date unavailable"}
                  </small>
                </div>

              </div>

              <div className="history-details">

                <div className="history-score">
                  <strong>
                    {Number(report.risk_score) || 0}%
                  </strong>

                  <span>
                    Compliance Score
                  </span>
                </div>

                <div className={getRiskClass(report.risk_level)}>
                  {report.risk_level} Risk
                </div>

                <div className="history-findings">
                  <strong>
                    {report.findings?.length || 0}
                  </strong>

                  <span>
                    Findings
                  </span>
                </div>

              </div>

              <div className="history-actions">

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate("/reports")
                  }
                >
                  👁 View Report
                </button>

                <button
                  className="download-btn"
                  onClick={() =>
                    downloadPDF(report.id)
                  }
                >
                  📥 Download PDF
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default History;