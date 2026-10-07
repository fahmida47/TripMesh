import { useState } from "react";

function ReviewForm({ guideCompanies, onSubmitReview, loading, saving = false }) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [message, setMessage] = useState("");
  const selectedGuide = guideCompanies.find(
    (company) => String(company.id) === selectedCompany,
  );
  const isEditing = Boolean(selectedGuide?.reviewId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompany) {
      setMessage("Please select a guide company.");
      return;
    }

    if (rating === 0) {
      setMessage("Please select a star rating.");
      return;
    }

    if (!reviewText.trim()) {
      setMessage("Please write your review.");
      return;
    }

    if (!selectedGuide) {
      setMessage("Selected guide company is not available.");
      return;
    }

    try {
      await onSubmitReview({
        bookingId: selectedGuide.id,
        reviewId: selectedGuide.reviewId,
        rating,
        reviewText: reviewText.trim(),
      });

      setSelectedCompany("");
      setRating(0);
      setReviewText("");
      setMessage(isEditing ? "Review updated successfully." : "Review submitted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to submit review.");
    }
  };

  const handleCancel = () => {
    setSelectedCompany("");
    setRating(0);
    setReviewText("");
    setMessage("");
  };

  return (
    <section className="write-review-card">
      <div className="write-review-heading">
        <div className="write-review-icon">✎</div>

        <div>
          <h2>{isEditing ? "Edit Your Review" : "Write a Review"}</h2>
          <p>Select a guide company and share your experience.</p>
        </div>
      </div>

      <form className="tourist-review-form" onSubmit={handleSubmit}>
        {/* GUIDE COMPANY */}
        <div className="review-form-field">
          <label htmlFor="guide-company">Select Guide Company</label>

          <select
            id="guide-company"
            value={selectedCompany}
            onChange={(e) => {
              const value = e.target.value;
              const company = guideCompanies.find((item) => String(item.id) === value);
              setSelectedCompany(value);
              setRating(company?.rating || 0);
              setReviewText(company?.reviewText || "");
              setMessage("");
            }}
            disabled={loading || guideCompanies.length === 0}
          >
            <option value="">
              {loading
                ? "Loading eligible guide companies..."
                : guideCompanies.length === 0
                ? "No eligible bookings available"
                : "Select Guide Company"}
            </option>

            {guideCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.companyName}
                {company.experienceName ? ` — ${company.experienceName}` : ""}
                {company.reviewId ? " (Edit review)" : ""}
              </option>
            ))}
          </select>

          {!loading && guideCompanies.length === 0 && (
            <span className="review-form-hint">
              A guide appears after a booking is confirmed or completed, paid, and not reviewed yet.
            </span>
          )}
        </div>

        {/* STAR RATING */}
        <div className="review-form-field">
          <label>Your Rating</label>

          <div className="review-star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={
                  star <= rating ? "star-button selected" : "star-button"
                }
                onClick={() => {
                  setRating(star);
                  setMessage("");
                }}
                aria-label={`${star} star rating`}
              >
                ★
              </button>
            ))}
          </div>

          <span className="review-form-hint">Click a star to rate</span>
        </div>

        {/* REVIEW TEXT */}
        <div className="review-form-field">
          <label htmlFor="review-text">Your Review</label>

          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              setMessage("");
            }}
            maxLength={500}
            placeholder="Write your review here..."
          />

          <span className="review-character-count">
            {reviewText.length} / 500
          </span>
        </div>

        {message && (
          <p
            className={`review-form-message${
              message.includes("successfully.") ? " success" : ""
            }`}
          >
            {message}
          </p>
        )}

        {/* BUTTONS */}
        <div className="review-form-actions">
          <button
            type="button"
            className="review-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button type="submit" className="review-submit-btn" disabled={loading || saving}>
            {saving ? (isEditing ? "Saving..." : "Submitting...") : isEditing ? "Save Changes" : "Submit Review"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ReviewForm;
