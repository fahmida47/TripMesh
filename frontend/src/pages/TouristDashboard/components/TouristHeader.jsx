import { BellIcon, ChevronDownIcon, MenuIcon } from "./NavIcons";
import "./TouristHeader.css";

const TOP_LINKS = ["Home", "Explore", "About Us", "Contact Us"];

export default function TouristHeader({
  profile,
  notificationCount = 3,
  onMenuClick,
}) {
  const initials = (profile?.fullName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <header className="ts-topbar">
      <div className="ts-topbar-left">
        <button
          type="button"
          className="ts-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <div className="ts-logo">
          <span className="ts-logo-mark" aria-hidden="true">
            <MapPinDot />
          </span>
          <span>
            Trip<span className="ts-logo-accent">Mesh</span>
          </span>
        </div>
      </div>

      <nav className="ts-topbar-links">
        {TOP_LINKS.map((link, i) => (
          <a key={link} href="#" className={i === 0 ? "active" : ""}>
            {link}
          </a>
        ))}
      </nav>

      <div className="ts-topbar-right">
        <button type="button" className="ts-bell" aria-label="Notifications">
          <BellIcon />
          {notificationCount > 0 && (
            <span className="ts-bell-badge">{notificationCount}</span>
          )}
        </button>

        <button type="button" className="ts-account">
          <span className="ts-account-avatar">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} />
            ) : (
              initials
            )}
          </span>
          <span className="ts-account-text">
            <span className="ts-account-name">
              {profile?.fullName || "Guest"}
            </span>
            <span className="ts-account-role">Tourist</span>
          </span>
          <ChevronDownIcon className="ts-account-chevron" />
        </button>
      </div>
    </header>
  );
}

function MapPinDot() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}
