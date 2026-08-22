import { FiChevronDown, FiMenu, FiUser } from "react-icons/fi";

import "./TouristTopbar.css";

export default function TouristTopbar({ onMenuClick, onProfileClick }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const touristName = user.name || "Tourist";

  let registeredDate;

  if (user.registeredDate) {
    registeredDate = new Date(user.registeredDate);
  } else {
    registeredDate = new Date();

    const updatedUser = {
      ...user,
      registeredDate: registeredDate.toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  const formattedDate = registeredDate.toLocaleDateString("en-US", {
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
