import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!userId) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/reports/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      console.log("Notification report data:", data);

      if (
        !data.success ||
        !data.reports ||
        data.reports.length === 0
      ) {
        setNotifications([]);
        return;
      }

      const latestReport = data.reports[0];

      const findings = latestReport.findings || [];

      const generatedNotifications = findings.map(
        (finding, index) => ({
          id: index + 1,
          title: finding.issue,
          description: finding.recommendation,
          severity: finding.severity,
        })
      );

      setNotifications(generatedNotifications);

    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="notifications-page">
        <h1>Notifications</h1>

        <p>
          Stay updated with important compliance
          alerts.
        </p>

        <div className="notifications-container">
          <h2>🔔 Compliance Notifications</h2>

          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  // =====================================
  // NO NOTIFICATIONS
  // =====================================

  if (notifications.length === 0) {
    return (
      <div className="notifications-page">

        <h1>Notifications</h1>

        <p>
          Stay updated with important compliance
          alerts.
        </p>

        <div className="notifications-container">

          <h2>🔔 Compliance Notifications</h2>

          <div className="notification-card success">
            <div className="notification-icon">
              ✅
            </div>

            <div>
              <h3>No Compliance Alerts</h3>

              <p>
                No compliance issues were found in
                your latest analyzed document.
              </p>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // =====================================
  // NOTIFICATIONS
  // =====================================

  return (
    <div className="notifications-page">

      <h1>Notifications</h1>

      <p>
        Stay updated with important compliance
        alerts.
      </p>

      <div className="notifications-container">

        <h2>🔔 Compliance Notifications</h2>

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`notification-card ${
              notification.severity?.toLowerCase() ===
              "high"
                ? "high"
                : notification.severity?.toLowerCase() ===
                  "medium"
                ? "warning"
                : "low"
            }`}
          >

            <div className="notification-icon">
              {notification.severity === "High"
                ? "🔴"
                : notification.severity === "Medium"
                ? "🟠"
                : "🟢"}
            </div>

            <div>

              <h3>
                {notification.title}
              </h3>

              <p>
                {notification.description}
              </p>

              <span className="severity">
                {notification.severity} Risk
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Notifications;