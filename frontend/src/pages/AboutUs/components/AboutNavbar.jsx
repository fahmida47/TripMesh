import { Link } from "react-router-dom";
import "./AboutNavbar.css";

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

function AboutNavbar() {
  return (
    <header className="about-navbar">
      <div className="about-navbar-container">
        <Link className="about-logo" to="/">
          <span className="about-logo-icon">
            <LogoIcon />
          </span>

          <span className="about-logo-text">TripMesh</span>
        </Link>

        <nav className="about-nav-links">
          <Link to="/">Home</Link>
          <a href="#explore">Explore</a>
          <Link className="active" to="/about">
            About Us
          </Link>
          <a href="#contact">Contact</a>
        </nav>

        <div className="about-nav-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
}

export default AboutNavbar;