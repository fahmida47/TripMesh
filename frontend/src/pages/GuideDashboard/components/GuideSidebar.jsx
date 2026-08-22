import "./GuideSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiUser,
  FiMap,
  FiInbox,
  FiCalendar,
  FiLogOut,
  FiStar,
  FiX,
} from "react-icons/fi";

import logo from "../../../assets/logo.png";

const GuideSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`guide-sidebar ${sidebarOpen ? "guide-sidebar-open" : ""}`}
    >
      <div className="guide-sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-circle">
            <img src={logo} alt="TripMesh Logo" />
          </div>

          <div className="logo-text">
            <h2>TripMesh</h2>
            <p>Guide Company</p>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/guide-dashboard"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/guide-dashboard/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiUser />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/guide-dashboard/tour-services"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiMap />
            <span>Tour Services</span>
          </NavLink>

          <NavLink
            to="/guide-dashboard/requests"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiInbox />
            <span>Requests</span>
          </NavLink>

          <NavLink
            to="/guide-dashboard/bookings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiCalendar />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/guide-dashboard/reviews"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FiStar />
            <span>Reviews and Ratings</span>
          </NavLink>
        </nav>
      </div>

      <button type="button" className="logout-btn" onClick={handleLogout}>
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default GuideSidebar;
