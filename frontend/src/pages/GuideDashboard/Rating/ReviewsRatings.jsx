import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

import "./ReviewsRatings.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ReviewsRatings = () => {
  const [reviewData, setReviewData] = useState({
    overall_rating: null,
    total_reviews: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
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

        if (!response.ok) {
          throw new Error(data.message || "Unable to load reviews.");
        }

        setReviewData(data);
      } catch (loadError) {
        setError(loadError.message || "Unable to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const hasReviews = reviewData.reviews.length > 0;

  return (
    <div className="reviews-page">
      <main className="reviews-main-content">
        <div className="reviews-page-container">
          {/* PAGE HEADER */}
          <div className="reviews-page-header">
            <div>
              <h1>Reviews & Ratings</h1>

              <p>
                See what travelers are saying about your tours and services.
              </p>
            </div>
          </div>

          {/* RATING SUMMARY */}
          <section className="reviews-rating-summary">
            <div className="reviews-rating-icon">
              <FiStar />
            </div>

            <div className="reviews-rating-info">
              <span className="reviews-rating-label">Overall Rating</span>

              <h2>
                {loading
                  ? "Loading..."
                  : reviewData.overall_rating === null
                    ? "Not rated yet"
                    : `${Number(reviewData.overall_rating).toFixed(1)} / 5`}
              </h2>

              <p>
                {loading
                  ? "Loading your reviews..."
                  : reviewData.total_reviews === 0
                    ? "You don't have any reviews yet."
                    : `Based on ${reviewData.total_reviews} review${reviewData.total_reviews === 1 ? "" : "s"}.`}
              </p>
            </div>
          </section>

          {/* CUSTOMER REVIEWS */}
          <section className="customer-reviews">
            <div className="customer-reviews-header">
              <div>
                <h2>Tourist Reviews</h2>

                <p>Feedback from travelers will appear here.</p>
              </div>

              <span className="reviews-total">
                {reviewData.total_reviews} Review{reviewData.total_reviews === 1 ? "" : "s"}
              </span>
            </div>

            {loading ? (
              <div className="reviews-empty-state"><p>Loading reviews...</p></div>
            ) : error ? (
              <div className="reviews-empty-state"><p className="reviews-error">{error}</p></div>
            ) : !hasReviews ? (
              <div className="reviews-empty-state">
                <div className="reviews-empty-icon"><FiStar /></div>
                <h3>No reviews yet</h3>
                <p>Once travelers review your tours and services, their feedback will appear here.</p>
              </div>
            ) : (
              <div className="guide-review-list">
                {reviewData.reviews.map((review) => (
                  <article className="guide-review-card" key={review.id}>
                    <div className="guide-review-card-header">
                      <div>
                        <h3>{review.tourist?.full_name || "Tourist"}</h3>
                        <p>{review.experience?.title || "Tour service"}</p>
                      </div>
                      <div className="guide-review-rating" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar className={star <= review.rating ? "filled" : ""} key={star} />
                        ))}
                      </div>
                    </div>
                    <p className="guide-review-text">{review.review}</p>
                    <time dateTime={review.submitted_at}>
                      {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : ""}
                    </time>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ReviewsRatings;
