import { useState } from "react";
import TouristSidebar from "./components/TouristSidebar";
import Explore from "../Explore/Explore";
import "./TouristDashboard.css";

export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">
        <TouristSidebar
          activeKey="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ts-shell-content ts-shell-content--explore">
          {/* Reuses the existing Explore page content (search, guide
              cards, filters, sorting) in "embedded" mode: no duplicate
              global Navbar is rendered, and this IS the Tourist
              Dashboard's main content now — no separate overview. */}
          <Explore embedded />
        </main>
      </div>

      <button
        type="button"
        className="ts-mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
    </div>
  );
}
