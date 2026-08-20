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
      <button
        type="button"
        className="ts-dashtopbar-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      <div className="ts-dashtopbar-welcome">
        <h2>Welcome back, {touristName}! 👋</h2>
        <p>{formattedDate}</p>
      </div>

      <div className="ts-dashtopbar-spacer" />

      <button
        type="button"
        className="ts-dashtopbar-account"
        onClick={onProfileClick}
        aria-label="Open profile"
      >
        <span className="ts-dashtopbar-avatar">
          <FiUser />
        </span>

        <span className="ts-dashtopbar-profile-text">
          {touristName}
        </span>

        <FiChevronDown className="ts-dashtopbar-chevron" />
      </button>
    </header>
  );
}