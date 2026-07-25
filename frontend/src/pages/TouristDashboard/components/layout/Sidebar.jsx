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
} from "./NavIcons";
import { PROMO_IMAGE } from "../../mockProfile";
import "./Sidebar.css";

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
  { key: "support", label: "Support", icon: HelpIcon },
];

/**
 * activeKey: which nav item is highlighted (defaults to "profile" since
 * this shell is used for the Profile Settings page).
 */
export default function Sidebar({ activeKey = "profile" }) {
  return (
    <aside className="ts-sidebar">
      <nav className="ts-nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <a
            key={key}
            href={`#${key}`}
            className={`ts-nav-item ${key === activeKey ? "active" : ""}`}
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
    </aside>
  );
}
