import { useState } from "react";

import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";
import RequestsBookings from "./components/RequestsBookings";
import TouristProfile from "./Profile/TouristProfile";
import PaymentHistory from "./components/PaymentHistory";
import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  const isRequestsBookings = activeKey === "bookings";
  const isProfile = activeKey === "profile";
  const isPayments = activeKey === "payments";

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
          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={() => setActiveKey("profile")}
          />

          <main
            className={`ts-shell-content ${
              isRequestsBookings || isPayments ? "" : "ts-shell-content--explore"
            }`}
          >
            {isProfile ? (
              <TouristProfile />
            ) : isRequestsBookings ? (
              <RequestsBookings />
            ) : isPayments ? (
              <PaymentHistory />
            ) : (
              <Explore embedded />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}