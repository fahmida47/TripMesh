import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LogoIcon = () => (
  <svg viewBox="0 0 40 50" aria-hidden="true">
    <path
      d="M20 2C10.6 2 3 9.6 3 19c0 12.7 17 28.5 17 28.5S37 31.7 37 19C37 9.6 29.4 2 20 2Z"
      fill="currentColor"
    />

    <circle cx="20" cy="18" r="10" fill="#03143d" />

    <path
      d="m13 18 5-2 5-6 3 2-4 7 4 3-2 3-5-3-3 4-2-1 1-6-2-1Z"
      fill="currentColor"
    />
  </svg>
);

function Navbar() {
  const location = useLocation();

  return (
    <header className="tm-navbar">
      <Link className="tm-navbar__brand" to="/">
        <span className="tm-navbar__logo">
          <LogoIcon />
        </span>

        <span>TripMesh</span>
      </Link>

      <nav className="tm-navbar__links" aria-label="Main navigation">
        <Link
          className={location.pathname === "/" ? "active" : ""}
          to="/"
        >
          Home
        </Link>

        <Link
          className={location.pathname === "/explore" ? "active" : ""}
          to="/explore"
        >
          Explore
        </Link>

        <Link
          className={location.pathname === "/about" ? "active" : ""}
          to="/about"
        >
          About Us
        </Link>

        <Link
          className={location.pathname === "/contact" ? "active" : ""}
          to="/contact"
        >
          Contact Us
        </Link>
      </nav>

      <div className="tm-navbar__actions">
        <Link className="tm-navbar__login" to="/login">
          Log In
        </Link>

        <Link className="tm-navbar__signup" to="/signup">
          Sign Up
        </Link>
      </div>
    </header>
  );
}

export default Navbar;