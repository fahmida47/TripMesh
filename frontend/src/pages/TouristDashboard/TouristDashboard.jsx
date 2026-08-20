import { useState } from "react";

import TouristSidebar from "./components/TouristSidebar";

import TouristTopbar from "./components/TouristTopbar";

import RequestsBookings from "./components/RequestsBookings";

import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeKey, setActiveKey] =
    useState("dashboard");

  const isRequestsBookings =
    activeKey === "bookings";

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

          <TouristTopbar />

          <main
            className={`ts-shell-content ${
              isRequestsBookings
                ? ""
                : "ts-shell-content--explore"
            }`}
          >

            {isRequestsBookings ? (
              <RequestsBookings />
            ) : (
              <Explore embedded />
            )}

          </main>

        </div>

      </div>

    </div>
  );
}