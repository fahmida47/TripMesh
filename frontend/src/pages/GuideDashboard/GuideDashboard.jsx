import "./GuideDashboard.css";

import GuideSidebar from "./components/GuideSidebar";
import GuideHeader from "./components/GuideHeader";
import DashboardOverview from "./components/DashboardOverview";

const GuideDashboard = () => {
  return (
    <div className="guide-dashboard">
      <GuideSidebar />

      <div className="dashboard-content">
        <GuideHeader />

        <div className="dashboard-body">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
