import "./GuideDashboard.css";
import GuideSidebar from "./components/GuideSidebar";
import GuideHeader from "./components/GuideHeader";

const GuideDashboard = () => {
  return (
    <div className="guide-dashboard">

      <GuideSidebar />

      <div className="dashboard-content">

        <GuideHeader />

        <div className="dashboard-body">

          {/* Statistics Cards */}

          {/* Requests */}

          {/* Earnings */}

          {/* More sections will be added later */}

        </div>

      </div>

    </div>
  );
};

export default GuideDashboard;