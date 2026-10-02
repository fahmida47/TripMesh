import "./GuideHeader.css";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiMenu, FiUser } from "react-icons/fi";
import { getStoredUser } from "../../../utils/auth.js";
import NotificationBell from "../../../components/Notifications/NotificationBell";

const GuideHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = getStoredUser() || {};

  const guideName = user.name || "Guide";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="guide-header">
      <button
        type="button"
        className="guide-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open navigation menu"
      >
        <FiMenu />
      </button>

      <div className="guide-header-text">
        <h2>Welcome back, {guideName}! 👋</h2>
        <p>{formattedDate}</p>
      </div>

      <div className="guide-header-actions">
        <NotificationBell variant="light" />

        <button
          type="button"
          className="guide-header-account"
          onClick={() => navigate("/guide-dashboard/profile")}
          aria-label="Open guide profile"
        >
          <span className="guide-header-avatar">
            <FiUser />
          </span>
          <span className="guide-header-profile-info">
            <span className="guide-header-profile-name">{guideName}</span>
            <span className="guide-header-profile-role">Guide</span>
          </span>
          <FiChevronDown className="guide-header-chevron" />
        </button>
      </div>
    </header>
  );
};

export default GuideHeader;
