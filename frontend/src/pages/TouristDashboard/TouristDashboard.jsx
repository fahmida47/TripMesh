import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";
import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

// Dashboard home. The sidebar navigates between routes (bookings, payments,
// reviews, profile), so this page only renders the shell around Explore.
export default function TouristDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">
        <TouristSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="ts-shell-main">
          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={() => navigate("/tourist-dashboard/profile")}
          />

          <main className="ts-shell-content">
            <Explore embedded />
          </main>
        </div>
      </div>
    </div>
  );
}
