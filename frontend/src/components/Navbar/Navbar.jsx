import { Link } from "react-router-dom";
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
  return (
    <header className="tm-navbar">
      <Link className="tm-navbar__brand" to="/">
        <span className="tm-navbar__logo">
          <LogoIcon />
        </span>

        <span>TripMesh</span>
      </Link>

      <nav className="tm-navbar__links" aria-label="Main navigation">
        <Link className="active" to="/">
          Home
        </Link>

        <a href="#explore">Explore</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact Us</a>
      </nav>

      <div className="tm-navbar__actions">
        <a className="tm-navbar__login" href="#login">
          Log In
        </a>

        <a className="tm-navbar__signup" href="#signup">
          Sign Up
        </a>
      </div>
    </header>
  );
}

export default Navbar;