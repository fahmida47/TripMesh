import "./GuideHeader.css";
import { FiMenu } from "react-icons/fi";
import { getStoredUser } from "../../../utils/auth.js";
import NotificationBell from "../../../components/Notifications/NotificationBell";

const GuideHeader = ({ sidebarOpen, setSidebarOpen }) => {
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
      </div>
    </header>
  );
};

export default GuideHeader;
