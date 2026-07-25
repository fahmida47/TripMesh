import "./GuideHeader.css";
import { FiBell, FiMenu } from "react-icons/fi";

const GuideHeader = () => {

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="guide-header">

      <div className="header-left">

        <FiMenu className="menu-icon" />

        <div className="header-text">
          <h2>
            Welcome back,
            <span className="company-name"> PathPilot!</span> 
          </h2>

          <p>{today}</p>
        </div>

      </div>

      <button className="notification-btn">
        <FiBell />
        <span className="notification-count">5</span>
      </button>

    </header>
  );
};

export default GuideHeader;