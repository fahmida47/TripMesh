import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../Notifications/NotificationBell";
import { getLoggedInUser } from "../../utils/auth";
import "./Navbar.css";

const LogoIcon = () => (
  <svg viewBox="0 0 40 50" aria-hidden="true" className="w-full h-full">
    <path
      d="M20 2C10.6 2 3 9.6 3 19c0 12.7 17 28.5 17 28.5S37 31.7 37 19C37 9.6 29.4 2 20 2Z"
      fill="currentColor"
    />
    <circle cx="20" cy="18" r="10" fill="#03143d" />
  </svg>
);

const ROLE_HOME = {
  guide: "/guide-dashboard",
  tourist: "/tourist-dashboard",
  admin: "/admin/dashboard",
};

const SECTION_ROUTES = {
  home: "/",
  explore: "/explore",
  about: "/about",
  contact: "/contact",
};

function sectionFromPath(pathname) {
  const match = Object.entries(SECTION_ROUTES).find(
    ([, route]) => route !== "/" && pathname.startsWith(route),
  );
  return match ? match[0] : "home";
}

/*
  Landing page: pass `onSectionChange` (scrolls the one-page layout).
  Standalone pages (/explore, /about, /contact): no callback, so the
  links use router navigation instead.
*/
function Navbar({ activeSection, onSectionChange }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = getLoggedInUser();
  const dashboardPath = user ? ROLE_HOME[user.role] : null;

  const current = activeSection ?? sectionFromPath(pathname);

  const goToSection = (sectionId) => {
    setMenuOpen(false);

    if (onSectionChange) {
      onSectionChange(sectionId);
      return;
    }

    navigate(SECTION_ROUTES[sectionId] ?? "/");
  };

  /* =========================
     NAVBAR
     ========================= */

  return (
    <header className="tm-navbar">
      {/* LOGO */}
      <button
        type="button"
        className="tm-navbar__brand"
        onClick={() => goToSection("home")}
      >
        <span className="tm-navbar__logo">
          <LogoIcon />
        </span>

        <span>TripMesh</span>
      </button>

      {/* NAVIGATION */}
      <nav
        className={`tm-navbar__links ${
          menuOpen ? "tm-navbar__links--open" : ""
        }`}
        aria-label="Main navigation"
      >
        {/* HOME */}
        <button
          type="button"
          className={current === "home" ? "active" : ""}
          onClick={() => goToSection("home")}
        >
          Home
        </button>

        {/* EXPLORE */}
        <button
          type="button"
          className={current === "explore" ? "active" : ""}
          onClick={() => goToSection("explore")}
        >
          Explore
        </button>

        {/* ABOUT US */}
        <button
          type="button"
          className={current === "about" ? "active" : ""}
          onClick={() => goToSection("about")}
        >
          About Us
        </button>

        {/* CONTACT US */}
        <button
          type="button"
          className={current === "contact" ? "active" : ""}
          onClick={() => goToSection("contact")}
        >
          Contact Us
        </button>
      </nav>

      {/* LOGIN / SIGNUP / HAMBURGER */}
      <div className="tm-navbar__actions">
        {dashboardPath ? (
          <>
            {/* NOTIFICATIONS (signed-in users) */}
            <NotificationBell
              variant="dark"
              onOpenChange={(open) => open && setMenuOpen(false)}
            />

            {/* DASHBOARD */}
            <Link className="tm-navbar__signup" to={dashboardPath}>
              Dashboard
            </Link>
          </>
        ) : (
          <>
            {/* LOGIN */}
            <Link className="tm-navbar__login" to="/login">
              Log In
            </Link>

            {/* SIGNUP */}
            <Link className="tm-navbar__signup" to="/signup">
              Sign Up
            </Link>
          </>
        )}

        {/* MOBILE HAMBURGER */}
        <button
          type="button"
          className={`tm-navbar__menu ${
            menuOpen ? "tm-navbar__menu--open" : ""
          }`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
