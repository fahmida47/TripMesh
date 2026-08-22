import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiLogOut,
} from "react-icons/fi";

import "./TouristSidebar.css";
import logo from "../../../assets/logo.png";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: FiGrid,
    path: "/tourist-dashboard",
    end: true,
  },
  {
    label: "My Profile",
    icon: FiUser,
    path: "/tourist-dashboard/profile",
  },
  {
    label: "Bookings",
    icon: FiCalendar,
    path: "/tourist-dashboard/bookings",
  },
  {
    label: "Payments",
    icon: FiDollarSign,
    path: "/tourist-dashboard/payments",
  },
  {
    label: "Reviews & Ratings",
    icon: FiStar,
    path: "/tourist-dashboard/reviews",
  },
];

export default function TouristSidebar({ isOpen = false, onClose }) {
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
        <button
          type="button"
          className="ts-sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className="ts-sidebar-top">
          <div className="ts-sidebar-logo">
            <div className="ts-logo-circle">
              <img src={logo} alt="TripMesh Logo" />
            </div>

            <div className="ts-logo-text">
              <h2>TripMesh</h2>
              <p>Tourist</p>
            </div>
          </div>

          <nav className="ts-sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? "ts-sidebar-link active" : "ts-sidebar-link"
                  }
                  onClick={() => onClose?.()}
                >
                  <Icon />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button type="button" className="ts-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
