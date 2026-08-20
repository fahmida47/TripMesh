import { useState } from "react";
import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";
import RequestsBookings from "./components/RequestsBookings";
import Explore from "../Explore/Explore";
import "./TouristDashboard.css";

export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  const isRequestsBookings = activeKey === "bookings";

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">
        <TouristSidebar
          activeKey={activeKey}
          onNavigate={setActiveKey}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="ts-shell-main">
          <TouristTopbar onMenuClick={() => setSidebarOpen(true)} />

          <main
            className={`ts-shell-content ${
              isRequestsBookings ? "" : "ts-shell-content--explore"
            }`}
          >
            {isRequestsBookings ? (
              // My Requests & Bookings — opened from the sidebar's
              // "My Bookings" nav item.
              <RequestsBookings />
            ) : (
              // Reuses the existing Explore page content (search, guide
              // cards, filters, sorting) in "embedded" mode: no duplicate
              // global Navbar is rendered, and this IS the Tourist
              // Dashboard's main content now — no separate overview.
              <Explore embedded />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
