import { FiStar } from "react-icons/fi";

import "./ReviewsRatings.css";

const ReviewsRatings = () => {
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

              <h2>Not rated yet</h2>

              <p>You don't have any reviews yet.</p>
            </div>
          </section>

          {/* CUSTOMER REVIEWS */}
          <section className="customer-reviews">
            <div className="customer-reviews-header">
              <div>
                <h2>Tourist Reviews</h2>

                <p>Feedback from travelers will appear here.</p>
              </div>

              <span className="reviews-total">0 Reviews</span>
            </div>

            {/* EMPTY STATE */}
            <div className="reviews-empty-state">
              <div className="reviews-empty-icon">
                <FiStar />
              </div>

              <h3>No reviews yet</h3>

              <p>
                Once travelers review your tours and services, their feedback
                will appear here.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ReviewsRatings;
