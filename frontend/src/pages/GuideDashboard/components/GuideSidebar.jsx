import "./GuideSidebar.css";

import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiUser,
  FiMap,
  FiInbox,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiLogOut,
  FiStar,
} from "react-icons/fi";

import logo from "../../../assets/logo.png";

const GuideSidebar = () => {
  const navigate = useNavigate();

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  return (
    <aside className="guide-sidebar">
      <div className="guide-sidebar-top">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-circle">
            <img src={logo} alt="TripMesh Logo" />
          </div>

          <div className="logo-text">
            <h2>TripMesh</h2>
            <p>Guide Company</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          {/* Dashboard */}
          <NavLink
            to="/guide-dashboard"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          {/* My Profile */}
          <NavLink
            to="/guide-dashboard/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiUser />
            <span>My Profile</span>
          </NavLink>

          {/* Tour Services */}
          <NavLink
            to="/guide-dashboard/tour-services"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiMap />
            <span>Tour Services</span>
          </NavLink>

          {/* Requests */}
          <NavLink
            to="/guide-dashboard/requests"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiInbox />
            <span>Requests</span>
          </NavLink>

          {/* Bookings */}
          <a href="#" className="sidebar-link">
            <FiCalendar />
            <span>Bookings</span>
          </a>

          {/* Payments */}
          <a href="#" className="sidebar-link">
            <FiDollarSign />
            <span>Payments</span>
          </a>

          {/* Reviews */}
          <a href="#" className="sidebar-link">
            <FiStar />
            <span>Reviews and Ratings</span>
          </a>

          {/* Messages */}
          <a href="#" className="sidebar-link">
            <FiMessageSquare />
            <span>Messages</span>
          </a>

        </nav>
      </div>

      {/* Logout */}
      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default GuideSidebar;