import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookIcon,
  CardIcon,
  StarIcon,
  HeartIcon,
  MailIcon,
  UserGearIcon,
  HelpIcon,
  LogOutIcon,
  CloseIcon,
  LogoMarkIcon,
} from "./NavIcons";
import "./TouristSidebar.css";

// No badge counts here on purpose — this is a frontend-only mock page
// with no logged-in session or real request/message data behind it.
// "My Requests" isn't a separate nav item — the combined My Requests &
// Bookings page (with tabs for both) opens from "My Bookings" below.
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: HomeIcon },
  { key: "profile", label: "My Profile", icon: UserGearIcon },
  { key: "bookings", label: "My Bookings", icon: BookIcon },
  { key: "payments", label: "My Payments", icon: CardIcon },
  { key: "reviews", label: "My Reviews", icon: StarIcon },
  { key: "favorites", label: "My Favorites", icon: HeartIcon },
  { key: "messages", label: "Messages", icon: MailIcon },
  { key: "support", label: "Help & Support", icon: HelpIcon },
];

/**
 * activeKey: which nav item is highlighted (defaults to "dashboard").
 * onNavigate: optional (key) => void, called when a nav item is clicked —
 * left as a no-op-friendly prop since routing isn't wired up here yet.
 * isOpen / onClose: drive the off-canvas drawer on tablet & mobile
 * (desktop ignores these and shows the sidebar inline, always visible).
 */
export default function TouristSidebar({
  activeKey = "dashboard",
  onNavigate,
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // Frontend-only mock: no real session/token to clear yet, just
    // send the tourist back to the homepage.
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div className="ts-sidebar-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`ts-sidebar ${isOpen ? "open" : ""}`}>
        <button
          type="button"
          className="ts-sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>

        <div className="ts-brand">
          <span className="ts-brand-mark" aria-hidden="true">
            <LogoMarkIcon />
          </span>
          <span className="ts-brand-name">
            Trip<span className="ts-brand-accent">Mesh</span>
          </span>
        </div>

        <nav className="ts-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <a
              key={key}
              href={`#${key}`}
              className={`ts-nav-item ${key === activeKey ? "active" : ""}`}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(key);
                }
                onClose?.();
              }}
            >
              <Icon />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a href="#logout" className="ts-logout" onClick={handleLogout}>
          <LogOutIcon />
          <span>Log Out</span>
        </a>
      </aside>
    </>
  );
}
