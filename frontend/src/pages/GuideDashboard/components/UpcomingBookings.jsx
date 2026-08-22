import { useNavigate } from "react-router-dom";
import "./UpcomingBookings.css";

const UpcomingBookings = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/guide-dashboard/bookings");
  };

  return (
    <section className="upcoming-bookings-card">
      <div className="upcoming-bookings-header">
        <h3>Bookings</h3>

        <button
          type="button"
          className="booking-view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      <div className="upcoming-bookings-empty">
        <p>No bookings yet</p>

        <span>Accepted tour requests will appear here.</span>
      </div>
    </section>
  );
};

export default UpcomingBookings;
