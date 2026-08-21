import { useNavigate } from "react-router-dom";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/guide-dashboard/reviews");
  };

  return (
    <section className="reviews-section-card">
      <div className="reviews-section-header">
        <h3>Reviews & Ratings</h3>

        <button
          type="button"
          className="reviews-view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      <div className="reviews-section-empty">
        <p>Not rated yet</p>

        <span>
          Reviews from travelers will appear here once you receive them.
        </span>
      </div>
    </section>
  );
};

export default ReviewsSection;