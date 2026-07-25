import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const LogoIcon = () => (
  <svg viewBox="0 0 40 50" aria-hidden="true">
    <path
      d="M20 2C10.6 2 3 9.6 3 19c0 12.7 17 28.5 17 28.5S37 31.7 37 19C37 9.6 29.4 2 20 2Z"
      fill="currentColor"
    />

    <circle cx="20" cy="18" r="10" fill="#03143d" />
  </svg>
);

function Navbar() {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <header className="tm-navbar">
      <Link className="tm-navbar__brand" to="/">
        <span className="tm-navbar__logo">
          <LogoIcon />
        </span>

        <span>TripMesh</span>
      </Link>

      <nav className="tm-navbar__links">
        <Link className={pathname === "/" ? "active" : ""} to="/">
          Home
        </Link>

        <Link className={pathname === "/explore" ? "active" : ""} to="/explore">
          Explore
        </Link>

        <Link className={pathname === "/about" ? "active" : ""} to="/about">
          About Us
        </Link>

        <Link className={pathname === "/contact" ? "active" : ""} to="/contact">
          Contact Us
        </Link>

        {user?.role === "Tourist" && (
          <Link
            className={pathname === "/tourist-dashboard" ? "active" : ""}
            to="/tourist-dashboard"
          >
            Tourist Dashboard
          </Link>
        )}

        {user?.role === "Guide" && (
          <Link
            className={pathname === "/guide-dashboard" ? "active" : ""}
            to="/guide-dashboard"
          >
            Guide Dashboard
          </Link>
        )}
      </nav>

      <div className="tm-navbar__actions">
        {user ? (
          <button className="tm-navbar__signup" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="tm-navbar__login" to="/login">
              Log In
            </Link>

            <Link className="tm-navbar__signup" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
