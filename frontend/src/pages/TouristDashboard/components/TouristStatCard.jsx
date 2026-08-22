import {
  FiGrid,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiLogOut,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./TouristSidebar.css";
import logo from "../../../assets/logo.png";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: FiGrid,
    key: "dashboard",
  },
  {
    label: "My Profile",
    icon: FiUser,
    key: "profile",
  },
  {
    label: "Bookings",
    icon: FiCalendar,
    key: "bookings",
  },
  {
    label: "Payments",
    icon: FiDollarSign,
    key: "payments",
  },
  {
    label: "Reviews & Ratings",
    icon: FiStar,
    key: "reviews",
  },
];

export default function TouristSidebar({
  activeKey = "dashboard",
  onNavigate,
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  const handleNavigation = (key) => {
    if (onNavigate) {
      onNavigate(key);
    }

    onClose?.();
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  return (
    <>
      {/* =========================
          MOBILE BACKDROP
      ========================= */}

      {isOpen && (
        <div
          className="ts-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className={`ts-sidebar ${isOpen ? "open" : ""}`}>
        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="ts-sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FiX />
        </button>

        <div className="ts-sidebar-top">
          {/* =========================
              LOGO
          ========================= */}

          <div className="ts-sidebar-logo">
            <div className="ts-logo-circle">
              <img src={logo} alt="TripMesh Logo" />
            </div>

            <div className="ts-logo-text">
              <h2>TripMesh</h2>
              <p>Tourist</p>
            </div>
          </div>

          {/* =========================
              NAVIGATION
          ========================= */}

          <nav className="ts-sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const isActive = activeKey === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={
                    isActive ? "ts-sidebar-link active" : "ts-sidebar-link"
                  }
                  onClick={() => handleNavigation(item.key)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* =========================
            LOGOUT
        ========================= */}

        <button type="button" className="ts-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
