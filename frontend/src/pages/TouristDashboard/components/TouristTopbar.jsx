import { FiChevronDown, FiMenu, FiUser } from "react-icons/fi";

import "./TouristTopbar.css";
import { getStoredUser } from "../../../utils/auth.js";
import NotificationBell from "../../../components/Notifications/NotificationBell";

export default function TouristTopbar({ onMenuClick, onProfileClick }) {
  const user = getStoredUser() || {};

  const touristName = user.name || "Tourist";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="ts-dashtopbar">
      {/* MOBILE MENU */}
      <button
        type="button"
        className="ts-dashtopbar-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      {/* WELCOME SECTION */}
      <div className="ts-dashtopbar-welcome">
        <div className="ts-dashtopbar-title-row">
          <h2>Welcome back, {touristName}!</h2>

          <span className="ts-dashtopbar-wave">👋</span>
        </div>

        <p>{formattedDate}</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="ts-dashtopbar-actions">
        <NotificationBell variant="light" />

        <button
          type="button"
          className="ts-dashtopbar-account"
          onClick={onProfileClick}
          aria-label="Open profile"
        >
          <span className="ts-dashtopbar-avatar">
            <FiUser />
          </span>

          <span className="ts-dashtopbar-profile-info">
            <span className="ts-dashtopbar-profile-text">{touristName}</span>

            <span className="ts-dashtopbar-profile-role">Tourist</span>
          </span>

          <FiChevronDown className="ts-dashtopbar-chevron" />
        </button>
      </div>
    </header>
  );
}
