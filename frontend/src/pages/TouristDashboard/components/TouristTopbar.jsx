import { ChevronDownIcon } from "./NavIcons";
import { touristProfile } from "../mockProfile";
import "./TouristTopbar.css";

/**
 * Sits above the active page (Explore / My Requests & Bookings / etc.)
 * inside ts-shell-content. Mirrors the reference design's top-right
 * profile chip — the sidebar already carries the TripMesh logo and nav,
 * so this bar stays deliberately minimal. (Notification bell and account
 * name are hidden for now.) The avatar itself is left empty too — once
 * backend/auth is wired up, the logged-in tourist's initials/photo and
 * name will populate here.
 */
export default function TouristTopbar({ onMenuClick }) {
  return (
    <header className="ts-dashtopbar">
      <button
        type="button"
        className="ts-dashtopbar-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="ts-dashtopbar-spacer" />

      <button type="button" className="ts-dashtopbar-account">
        <span className="ts-dashtopbar-avatar">
          {touristProfile.avatar && (
            <img src={touristProfile.avatar} alt={touristProfile.fullName} />
          )}
        </span>
        <ChevronDownIcon className="ts-dashtopbar-chevron" />
      </button>
    </header>
  );
}
