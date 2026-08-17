import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  InboxIcon,
  BookIcon,
  CardIcon,
  StarIcon,
  HeartIcon,
  MailIcon,
  UserGearIcon,
  HelpIcon,
  LogOutIcon,
  CloseIcon,
} from "./NavIcons";
import { PROMO_IMAGE } from "../mockProfile";
import "./TouristSidebar.css";

// No badge counts here on purpose — this is a frontend-only mock page
// with no logged-in session or real request/message data behind it.
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: HomeIcon },
  { key: "requests", label: "My Requests", icon: InboxIcon },
  { key: "bookings", label: "My Bookings", icon: BookIcon },
  { key: "payments", label: "My Payments", icon: CardIcon },
  { key: "reviews", label: "My Reviews", icon: StarIcon },
  { key: "favorites", label: "My Favorites", icon: HeartIcon },
  { key: "messages", label: "Messages", icon: MailIcon },
  { key: "profile", label: "Profile Settings", icon: UserGearIcon },
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

        <div
          className="ts-promo"
          style={
            PROMO_IMAGE
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(11,22,56,0.15) 0%, rgba(11,22,56,0.85) 100%), url(${PROMO_IMAGE})`,
                }
              : undefined
          }
        >
          <p className="ts-promo-title">Discover Bangladesh</p>
          <p className="ts-promo-copy">
            Unforgettable journeys with trusted local guides
          </p>
          <button type="button" className="ts-promo-btn">
            Explore Now
          </button>
        </div>

        <a href="#logout" className="ts-logout" onClick={handleLogout}>
          <LogOutIcon />
          <span>Log Out</span>
        </a>
      </aside>
    </>
  );
}
