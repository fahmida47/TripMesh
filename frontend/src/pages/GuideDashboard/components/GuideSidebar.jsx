import "./GuideSidebar.css";
import { NavLink } from "react-router-dom";

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
  return (
    <aside className="guide-sidebar">
      <div className="guide-sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-circle">
            <img src={logo} alt="TripMesh Logo" />
          </div>

          <div className="logo-text">
            <h2>TripMesh</h2>
            <p>Guide Company</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* DASHBOARD */}
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

          {/* PROFILE */}
          <NavLink
            to="/guide-dashboard/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiUser />
            <span>My Profile</span>
          </NavLink>

          {/* TOUR SERVICES */}
          <NavLink
            to="/guide-dashboard/tour-services"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiMap />
            <span>Tour Services</span>
          </NavLink>

          {/* REQUESTS */}
          <a href="#" className="sidebar-link">
            <FiInbox />
            <span>Requests</span>
          </a>

          {/* BOOKINGS */}
          <a href="#" className="sidebar-link">
            <FiCalendar />
            <span>Bookings</span>
          </a>

          {/* PAYMENTS */}
          <a href="#" className="sidebar-link">
            <FiDollarSign />
            <span>Payments</span>
          </a>

          {/* REVIEWS */}
          <a href="#" className="sidebar-link">
            <FiStar />
            <span>Reviews and Ratings</span>
          </a>

          {/* MESSAGES */}
          <a href="#" className="sidebar-link">
            <FiMessageSquare />
            <span>Messages</span>
          </a>
        </nav>
      </div>

      {/* LOGOUT */}
      <button className="logout-btn">
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default GuideSidebar;