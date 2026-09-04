import { useEffect, useState } from "react";

import "./TouristReviews.css";
import ReviewForm from "./ReviewForm";

import TouristSidebar from "../components/TouristSidebar";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const formatReview = (review) => ({
  id: review.id,
  bookingId: review.booking_id,
  companyName:
    review.guide?.company_name ||
    review.booking?.guide?.company_name ||
    "Guide company",
  rating: review.rating,
  reviewText: review.review,
  submittedDate: review.submitted_at
    ? new Date(review.submitted_at).toLocaleDateString()
    : "",
});

function TouristReviews() {
  const [guideCompanies, setGuideCompanies] = useState([]);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadReviewData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [eligibleResponse, reviewsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/reviews/eligible`, { headers }),
          fetch(`${API_BASE_URL}/reviews`, { headers }),
        ]);
        const [eligibleData, reviewsData] = await Promise.all([
          eligibleResponse.json(),
          reviewsResponse.json(),
        ]);

        if (!eligibleResponse.ok) {
          throw new Error(eligibleData.message || "Failed to load eligible bookings.");
        }

        if (!reviewsResponse.ok) {
          throw new Error(reviewsData.message || "Failed to load your reviews.");
        }

        setGuideCompanies((eligibleData.bookings || []).map((booking) => ({
          id: booking.id,
          companyName: booking.guide?.company_name || "Guide company",
          experienceName: booking.experience?.title || booking.experience?.name,
        })));
        setSubmittedReviews((reviewsData.reviews || []).map(formatReview));
      } catch (error) {
        setLoadError(error.message || "Unable to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadReviewData();
  }, []);

  const handleReviewSubmit = async ({ bookingId, rating, reviewText }) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_id: bookingId,
        rating,
        review: reviewText,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to submit review.");
    }

    setSubmittedReviews((prev) => [
      formatReview(data.review),
      ...prev,
    ]);
    setGuideCompanies((prev) => prev.filter((company) => company.id !== bookingId));
  };

  return (
    <div className="tourist-reviews-layout">
      {/* SIDEBAR */}
      <TouristSidebar activeKey="reviews" />

      {/* MAIN CONTENT */}
      <main className="tourist-reviews-page">
        {/* PAGE HEADING */}
        <div className="tourist-reviews-heading">
          <h1>Reviews & Ratings</h1>

          <p>
            Share your experience and help other tourists
            choose the best guide companies.
          </p>
        </div>

        {/* REVIEW FORM */}
        <ReviewForm
          guideCompanies={guideCompanies}
          onSubmitReview={handleReviewSubmit}
          loading={loading}
        />

        {loadError && <p className="review-form-message">{loadError}</p>}

        {/* MY REVIEWS */}
        <section className="my-reviews-card">
          <div className="my-reviews-heading">
            <div>
              <h2>My Reviews</h2>
              <p>Reviews you have submitted.</p>
            </div>
          </div>

          {loading ? (
            <div className="reviews-empty-state">
              <p>Loading reviews...</p>
            </div>
          ) : submittedReviews.length === 0 ? (
            <div className="reviews-empty-state">
              <div className="reviews-empty-icon">
                ☆
              </div>

              <h3>No reviews yet</h3>

              <p>
                Your submitted reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="submitted-reviews-list">
              {submittedReviews.map((review) => (
                <article
                  key={review.id}
                  className="submitted-review-card"
                >
                  <div className="submitted-review-top">
                    <div>
                      <h3>
                        {review.companyName}
                      </h3>

                      <span>
                        Reviewed on {review.submittedDate}
                      </span>
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

                  <p className="submitted-review-text">
                    {review.reviewText}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ABOUT REVIEWS */}
        <section className="reviews-info-card">
          <div className="reviews-info-icon">
            i
          </div>

          <div>
            <h3>About Reviews</h3>

            <p>
              Be honest and respectful in your reviews.
              Your feedback helps other tourists find
              the best guide companies.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TouristReviews;
