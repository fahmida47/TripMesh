import { useState } from "react";
import TouristSidebar from "./components/TouristSidebar";
import TouristHeader from "./components/TouristHeader";
import TouristStats from "./components/TouristStats";
import DashboardOverview from "./components/DashboardOverview";
import { touristProfile } from "./mockProfile";
import "./TouristDashboard.css";

/**
 * Main Tourist Dashboard page — the approved-design layout:
 * navy top header, navy left sidebar (collapses into an off-canvas
 * drawer on tablet/mobile), light content area on the right.
 *
 * Route this at /dashboard (or wherever a tourist lands after login).
 */
export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ts-shell">
      <TouristHeader
        profile={touristProfile}
        notificationCount={3}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="ts-shell-body">
        <TouristSidebar
          activeKey="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ts-shell-content">
          <div className="ts-dashboard-header">
            <h1>Welcome back, {touristProfile.fullName.split(" ")[0]}! 👋</h1>
            <p>Plan your next adventure with TripMesh</p>
          </div>

          <TouristStats />

          <DashboardOverview />
        </main>
      </div>
    </div>
  );
}
