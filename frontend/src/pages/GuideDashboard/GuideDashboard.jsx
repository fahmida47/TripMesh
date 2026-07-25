import "./GuideDashboard.css";
import GuideSidebar from "./components/GuideSidebar";
import GuideHeader from "./components/GuideHeader";
import DashboardStats from "./components/DashboardStats";
import DashboardOverview from "./components/DashboardOverview";

const GuideDashboard = () => {
  return (
    <div className="guide-dashboard">

      <GuideSidebar />

      <div className="dashboard-content">

        <GuideHeader />

        <div className="dashboard-body">

          <DashboardStats />

          <DashboardOverview />

          {/* Requests */}

          {/* Earnings */}

          {/* More sections will be added later */}

        </div>

      </div>

    </div>
  );
};

export default GuideDashboard;
