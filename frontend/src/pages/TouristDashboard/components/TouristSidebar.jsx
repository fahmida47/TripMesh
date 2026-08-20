import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

import "./TouristSidebar.css";
import logo from "../../../assets/logo.png";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: FiGrid,
  },
  {
    key: "profile",
    label: "My Profile",
    icon: FiUser,
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: FiCalendar,
  },
  {
    key: "payments",
    label: "Payments",
    icon: FiDollarSign,
  },
  {
    key: "reviews",
    label: "Reviews & Ratings",
    icon: FiStar,
  },
  
];

export default function TouristSidebar({
  activeKey = "dashboard",
  onNavigate,
  isOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="ts-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`ts-sidebar ${isOpen ? "open" : ""}`}>
        {/* Mobile Close Button */}
        <button
          type="button"
          className="ts-sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>

        {/* Sidebar Top */}
        <div className="ts-sidebar-top">
          {/* Logo */}
          <div className="ts-sidebar-logo">
            <div className="ts-logo-circle">
              <img src={logo} alt="TripMesh Logo" />
            </div>

            <div className="ts-logo-text">
              <h2>TripMesh</h2>
              <p>Tourist</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="ts-sidebar-nav">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={`#${key}`}
                className={`ts-sidebar-link ${
                  key === activeKey ? "active" : ""
                }`}
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
        </div>

        {/* Logout */}
        <button className="ts-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}