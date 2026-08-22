import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";

import "./TouristDashboard.css";

export default function TouristLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/tourist-dashboard/profile");
  };

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">

        {/* SIDEBAR */}
        <TouristSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN AREA */}
        <div className="ts-shell-main">

          {/* TOPBAR - EVERY TOURIST PAGE */}
          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={handleProfileClick}
          />

          {/* PAGE CONTENT */}
          <main className="ts-shell-content">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}