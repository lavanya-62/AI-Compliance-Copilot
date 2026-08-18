import { Link, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUpload,
  FaFileAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("complianceReport");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <aside className="sidebar">

      <h2>AI Compliance</h2>

      <ul>

        <li>
          <Link to="/dashboard">
            <FaHome />
            <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/upload">
            <FaUpload />
            <span>Upload Documents</span>
          </Link>
        </li>

        <li>
          <Link to="/reports">
            <FaFileAlt />
            <span>Reports</span>
          </Link>
        </li>

        <li>
          <Link to="/notifications">
            <FaBell />
            <span>Notifications</span>
          </Link>
        </li>

        {/* HISTORY */}
        <li>
          <Link to="/history">
            <span>🕘</span>
            <span>Compliance History</span>
          </Link>
        </li>

        <li>
          <Link to="/profile">
            <FaUser />
            <span>Profile</span>
          </Link>
        </li>

        <li>
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;