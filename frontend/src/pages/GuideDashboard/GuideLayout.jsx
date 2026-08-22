import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./GuideDashboard.css";

import GuideSidebar from "./components/GuideSidebar";
import GuideHeader from "./components/GuideHeader";

const GuideLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="guide-dashboard">
      <GuideSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="dashboard-content">
        <GuideHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <Outlet />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
};

export default GuideLayout;
