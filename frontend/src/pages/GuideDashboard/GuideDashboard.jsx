import "./GuideDashboard.css";
import GuideSidebar from "./components/GuideSidebar";
import GuideHeader from "./components/GuideHeader";
import DashboardStats from "./components/DashboardStats";

const GuideDashboard = () => {
  return (
    <div className="guide-dashboard">

      <GuideSidebar />

      <div className="dashboard-content">

        <GuideHeader />

        <div className="dashboard-body">

          <DashboardStats />

          {/* Requests */}

          {/* Earnings */}

          {/* More sections will be added later */}

        </div>

      </div>

    </div>
  );
};

export default GuideDashboard;
