import "./GuideSidebar.css";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

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

    // User is no longer logged in
    localStorage.setItem(
      "isLoggedIn",
      "false"
    );

    // Go to Home page
    navigate("/");
  };

  return (
    <aside className="guide-sidebar">

      <div className="guide-sidebar-top">

        {/* Logo */}

        <div className="sidebar-logo">

          <div className="logo-circle">
            <img
              src={logo}
              alt="TripMesh Logo"
            />
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
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>


         

          {/* My Profile */}


          <NavLink
            to="/guide-dashboard/profile"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
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


          {/* Tour Services */}

          <a
            href="#"
            className="sidebar-link"

          >
            <FiMap />
            <span>Tour Services</span>
          </NavLink>


          {/* REQUESTS */}
          <a href="#" className="sidebar-link">


          {/* Requests */}

          <NavLink
            to="/guide-dashboard/requests"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >

            <FiInbox />
            <span>Requests</span>
          </NavLink>



          {/* BOOKINGS */}
          <a href="#" className="sidebar-link">

          {/* Bookings */}

          <a
            href="#"
            className="sidebar-link"
          >

            <FiCalendar />
            <span>Bookings</span>
          </a>


          {/* PAYMENTS */}
          <a href="#" className="sidebar-link">


          {/* Payments */}

          <a
            href="#"
            className="sidebar-link"
          >

            <FiDollarSign />
            <span>Payments</span>
          </a>


          {/* REVIEWS */}
          <a href="#" className="sidebar-link">


          {/* Reviews */}

          <a
            href="#"
            className="sidebar-link"
          >

            <FiStar />
            <span>Reviews and Ratings</span>
          </a>


          {/* MESSAGES */}
          <a href="#" className="sidebar-link">


          {/* Messages */}

          <a
            href="#"
            className="sidebar-link"
          >

            <FiMessageSquare />
            <span>Messages</span>
          </a>

        </nav>

      </div>


      {/* LOGOUT */}
      <button className="logout-btn">


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