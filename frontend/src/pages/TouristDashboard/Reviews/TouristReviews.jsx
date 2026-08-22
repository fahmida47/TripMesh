import { useState } from "react";
import "./TouristReviews.css";
import ReviewForm from "./ReviewForm";

function TouristReviews() {
  const [guideCompanies] = useState([]);
  const [submittedReviews, setSubmittedReviews] = useState([]);

  const handleReviewSubmit = (review) => {
    const newReview = {
      id: Date.now(),
      ...review,
      submittedDate: new Date().toLocaleDateString(),
    };

    setSubmittedReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="tourist-reviews-page">
      {/* PAGE HEADING */}
      <div className="tourist-reviews-heading">
        <h1>Reviews & Ratings</h1>
        <p>
          Share your experience and help other tourists choose the best guide
          companies.
        </p>
      </div>

      {/* WRITE REVIEW */}
      <ReviewForm
        guideCompanies={guideCompanies}
        onSubmitReview={handleReviewSubmit}
      />

      {/* MY REVIEWS */}
      <section className="my-reviews-card">
        <div className="my-reviews-heading">
          <div>
            <h2>My Reviews</h2>
            <p>Reviews you have submitted.</p>
          </div>
        </div>

        {submittedReviews.length === 0 ? (
          <div className="reviews-empty-state">
            <div className="reviews-empty-icon">☆</div>

            <h3>No reviews yet</h3>

            <p>Your submitted reviews will appear here.</p>
          </div>
        ) : (
          <div className="submitted-reviews-list">
            {submittedReviews.map((review) => (
              <article key={review.id} className="submitted-review-card">
                <div className="submitted-review-top">
                  <div>
                    <h3>{review.companyName}</h3>

                    <span>Reviewed on {review.submittedDate}</span>
                  </div>

                  <div className="submitted-review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? "review-star filled"
                            : "review-star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="submitted-review-text">{review.reviewText}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT REVIEWS */}
      <section className="reviews-info-card">
        <div className="reviews-info-icon">i</div>

        <div>
          <h3>About Reviews</h3>

          <p>
            Be honest and respectful in your reviews. Your feedback helps other
            tourists find the best guide companies.
          </p>
        </div>
      </section>
    </div>
  );
}

export default TouristReviews;
