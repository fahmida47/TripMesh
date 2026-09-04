import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ReviewsSection.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ReviewsSection = () => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    overall_rating: null,
    total_reviews: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/guide/reviews`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setReviewData(data);
        }
      } catch {
        // Keep the dashboard card in its empty state when the API is unavailable.
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

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

      {loading ? (
        <div className="reviews-section-empty"><span>Loading reviews...</span></div>
      ) : reviewData.total_reviews === 0 ? (
        <div className="reviews-section-empty">
          <p>Not rated yet</p>
          <span>Reviews from travelers will appear here once you receive them.</span>
        </div>
      ) : (
        <div className="reviews-section-content">
          <div className="reviews-section-summary">
            <FiStar />
            <strong>{Number(reviewData.overall_rating).toFixed(1)}</strong>
            <span>from {reviewData.total_reviews} review{reviewData.total_reviews === 1 ? "" : "s"}</span>
          </div>

          {reviewData.reviews.slice(0, 2).map((review) => (
            <article className="reviews-section-item" key={review.id}>
              <div>
                <strong>{review.tourist?.full_name || "Tourist"}</strong>
                <span>{review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : ""}</span>
              </div>
              <div className="reviews-section-stars" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar className={star <= review.rating ? "filled" : ""} key={star} />
                ))}
              </div>
              <p>{review.review}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
