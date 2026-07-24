import "./GuideSidebar.css";

import {
    FiGrid,
    FiUser,
    FiClipboard,
    FiCalendar,
    FiDollarSign,
    FiMessageSquare,
    FiLogOut
} from "react-icons/fi";

import logo from "../../../assets/logo.png";
import sidebarBg from "../../../assets/sidebar-bg.jpg";

const GuideSidebar = () => {

    return (

        <aside className="guide-sidebar">

            <div>

                <div className="sidebar-logo">

                    <div className="logo-circle">
                        <img src={logo} alt="TripMesh Logo" />
                    </div>

                    <div className="logo-text">
                        <h2>PathPilot</h2>
                        <p>Guide Company</p>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <a href="#" className="active">

                        <FiGrid />

                        Dashboard

                    </a>

                    <a href="#">

                        <FiUser />

                        My Profile

                    </a>

                    <a href="#">

                        <FiClipboard />

                        Requests

                    </a>

                    <a href="#">

                        <FiCalendar />

                        Bookings

                    </a>

                    <a href="#">

                        <FiDollarSign />

                        Earnings

                    </a>

                    <a href="#">

                        <FiMessageSquare />

                        Messages

                    </a>

                </nav>
                <div
                    className="add-tour-card"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${sidebarBg})`,
                    }}
                >

                    <h3>Grow Your Business</h3>

                    <p>
                        Keep your calendar updated and
                        <br />
                        get more bookings.
                    </p>

                    <button>Add New Tour</button>

                    </div>

            </div>

            <button className="logout-btn">

                <FiLogOut />

                Log Out

            </button>

        </aside>

    );

};

export default GuideSidebar;