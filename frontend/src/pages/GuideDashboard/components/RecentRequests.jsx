import { useNavigate } from "react-router-dom";
import "./RecentRequests.css";

const RecentRequests = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/guide-dashboard/requests");
  };

  return (
    <section className="recent-requests-card">
      <div className="recent-requests-header">
        <h3>Requests</h3>

        <button
          type="button"
          className="requests-view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      <div className="recent-requests-empty">
        <p>No requests yet</p>

        <span>New travel requests from tourists will appear here.</span>
      </div>
    </section>
  );
};

export default RecentRequests;
