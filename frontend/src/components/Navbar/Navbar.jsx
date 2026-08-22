import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function Navbar() {
  const { pathname } = useLocation();

  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================
     HOME PAGE SECTION SCROLL
     ========================= */

  const goToSection = (sectionId) => {
    const landingPage = document.querySelector(".tm-landing");
    const section = document.getElementById(sectionId);

    if (!landingPage || !section) {
      return;
    }

    /* Active navbar line */
    setActiveSection(sectionId);

    /* Close mobile menu */
    setMenuOpen(false);

    /*
      About Us + Contact Us
      previous scroll position reset
    */
    const sectionContent = section.querySelector(".tm-section-content");

    if (sectionContent) {
      sectionContent.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    /*
      Explore-এর scrollbar
    */
    const explorePage = section.querySelector(".explore-page");

    if (explorePage) {
      explorePage.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    /*
      Main landing page selected
    */
    landingPage.scrollTo({
      top: section.offsetTop,
      left: 0,
      behavior: "smooth",
    });
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
          className={activeSection === "home" ? "active" : ""}
          onClick={() => goToSection("home")}
        >
          Home
        </button>

        {/* EXPLORE */}
        <button
          type="button"
          className={activeSection === "explore" ? "active" : ""}
          onClick={() => goToSection("explore")}
        >
          Explore
        </button>

        {/* ABOUT US */}
        <button
          type="button"
          className={activeSection === "about" ? "active" : ""}
          onClick={() => goToSection("about")}
        >
          About Us
        </button>

        {/* CONTACT US */}
        <button
          type="button"
          className={activeSection === "contact" ? "active" : ""}
          onClick={() => goToSection("contact")}
        >
          Contact Us
        </button>
      </nav>

      {/* LOGIN / SIGNUP / HAMBURGER */}
      <div className="tm-navbar__actions">
        {/* LOGIN */}
        <Link className="tm-navbar__login" to="/login">
          Log In
        </Link>

        {/* SIGNUP */}
        <Link className="tm-navbar__signup" to="/signup">
          Sign Up
        </Link>

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
