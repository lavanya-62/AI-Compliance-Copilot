import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const API_URL = "https://ai-compliance-copilot-pfq8.onrender.com";

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [business, setBusiness] = useState(
    storedUser?.business || ""
  );

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Account statistics
  const [documents, setDocuments] = useState(0);
  const [reports, setReports] = useState(0);
  const [notifications, setNotifications] = useState(0);

  // ================================
  // LOAD PROFILE STATISTICS
  // ================================

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      if (!storedUser?.id) {
        console.error("User ID not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/reports/dashboard/${storedUser.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile statistics");
      }

      const data = await response.json();

      // Documents uploaded / checked
      setDocuments(Number(data.documentsChecked) || 0);

      // Every analyzed document has a report
      setReports(Number(data.documentsChecked) || 0);

      // Notifications
      // For now, use total compliance findings as alerts
      setNotifications(Number(data.totalFindings) || 0);

    } catch (error) {
      console.error("Profile statistics error:", error);
    }
  };

  // ================================
  // SAVE PROFILE
  // ================================

  const handleSave = async () => {
    if (!name || !email || !business) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: storedUser.id,
            name,
            email,
            business,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile update failed"
        );
      }

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setEditing(false);

      setMessage(
        "✅ Profile updated successfully."
      );

    } catch (error) {
      console.error(error);

      setMessage(
        `❌ ${error.message}`
      );

    } finally {
      setSaving(false);
    }
  };

  // ================================
  // CANCEL EDIT
  // ================================

  const handleCancel = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setBusiness(currentUser?.business || "");

    setEditing(false);
    setMessage("");
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* HEADER */}
        <div className="profile-header">

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your account and business information.
            </p>
          </div>

        </div>

        {/* PROFILE CARD */}
        <div className="profile-card">

          {/* PROFILE TOP */}
          <div className="profile-top">

            <div className="profile-avatar">
              {name
                ? name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>

              <h2>{name}</h2>

              <p>{email}</p>

              <span className="account-badge">
                MSME Account
              </span>

            </div>

          </div>


          {/* PERSONAL INFORMATION */}
          <div className="profile-section">

            <div className="section-heading">

              <h2>
                Personal Information
              </h2>

              {!editing && (
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                  }}
                >
                  ✏️ Edit Profile
                </button>
              )}

            </div>


            <div className="profile-grid">

              {/* FULL NAME */}
              <div className="profile-field">

                <label>
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                ) : (
                  <div className="field-value">
                    {name}
                  </div>
                )}

              </div>


              {/* EMAIL */}
              <div className="profile-field">

                <label>
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                ) : (
                  <div className="field-value">
                    {email}
                  </div>
                )}

              </div>


              {/* BUSINESS */}
              <div className="profile-field">

                <label>
                  Business Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={business}
                    onChange={(e) =>
                      setBusiness(e.target.value)
                    }
                  />
                ) : (
                  <div className="field-value">
                    {business}
                  </div>
                )}

              </div>


              {/* ACCOUNT TYPE */}
              <div className="profile-field">

                <label>
                  Account Type
                </label>

                <div className="field-value">
                  MSME
                </div>

              </div>

            </div>


            {/* EDIT BUTTONS */}
            {editing && (
              <div className="profile-actions">

                <button
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>
            )}


            {/* MESSAGE */}
            {message && (
              <div className="profile-message">
                {message}
              </div>
            )}

          </div>


          {/* ACCOUNT OVERVIEW */}
          <div className="profile-section">

            <h2>Account Overview</h2>

            <div className="profile-stats">

              {/* DOCUMENTS */}
              <div className="profile-stat">

                <span>📄</span>

                <strong>
                  {documents}
                </strong>

                <p>
                  Documents Uploaded
                </p>

              </div>


              {/* REPORTS */}
              <div className="profile-stat">

                <span>📊</span>

                <strong>
                  {reports}
                </strong>

                <p>
                  Compliance Reports
                </p>

              </div>


              {/* NOTIFICATIONS */}
              <div className="profile-stat">

                <span>🔔</span>

                <strong>
                  {notifications}
                </strong>

                <p>
                  Compliance Alerts
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;