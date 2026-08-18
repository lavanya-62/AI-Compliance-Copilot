import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("complianceReport");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <div className="app-layout">

      <aside className="sidebar">

        <div className="sidebar-title">
          AI Compliance
        </div>

        <nav className="sidebar-menu">

          <NavLink to="/dashboard" className="sidebar-link">
            <span>🏠</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/upload" className="sidebar-link">
            <span>⬆️</span>
            <span>Upload Documents</span>
          </NavLink>

          <NavLink to="/reports" className="sidebar-link">
            <span>📄</span>
            <span>Reports</span>
          </NavLink>

          <NavLink to="/notifications" className="sidebar-link">
            <span>🔔</span>
            <span>Notifications</span>
          </NavLink>

          {/* COMPLIANCE HISTORY */}
          <NavLink to="/history" className="sidebar-link">
            <span>🕘</span>
            <span>Compliance History</span>
          </NavLink>

          <NavLink to="/profile" className="sidebar-link">
            <span>👤</span>
            <span>Profile</span>
          </NavLink>

          <button
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </nav>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;