import { useNavigate } from "react-router-dom";
import "./TopTourServices.css";

const TopTourServices = () => {
  const navigate = useNavigate();

  const handleManageAll = () => {
    navigate("/guide-dashboard/tour-services");
  };

  return (
    <section className="top-tour-services-card">
      <div className="top-tour-services-header">
        <h3>Your Top Tour Services</h3>

        <button
          type="button"
          className="manage-all-btn"
          onClick={handleManageAll}
        >
          Manage All
        </button>
      </div>

      <div className="top-tour-services-empty">
        <p>No booking data yet</p>
        <span>Your most booked tour services will appear here.</span>
      </div>
    </section>
  );
};

export default TopTourServices;
