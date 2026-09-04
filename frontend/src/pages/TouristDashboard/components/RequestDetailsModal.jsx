import { useEffect } from "react";

import {
  FiX,
  FiStar,
  FiXCircle,
  FiCreditCard,
} from "react-icons/fi";

import "./RequestsBookings.css";

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString("en-BD");
}

function badgeClass(status) {
  if (!status) {
    return "rb-badge";
  }

  return `rb-badge rb-badge--${String(status)
    .toLowerCase()
    .replace(/[\s_-]+/g, "")}`;
}

function getCompanyInitial(companyName) {
  if (!companyName) {
    return "G";
  }

  return companyName.charAt(0).toUpperCase();
}

export default function RequestDetailsModal({
  item,
  onClose,
  onCancel,
  onPayNow,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) {
    return null;
  }

  /*
   * Backend booking data
   */
  const booking = item;

  const guide = booking.guide || {};
  const experience = booking.experience || {};
  const travelRequest = booking.travelRequest || {};
  const payment = booking.payment || {};

  /*
   * Guide information
   */
  const guideName =
    guide.name ||
    guide.full_name ||
    guide.fullName ||
    "Guide";

  const companyName =
    guide.company_name ||
    guide.companyName ||
    guide.business_name ||
    "Guide Company";

  const companyRating =
    guide.rating ||
    guide.average_rating ||
    null;

  /*
   * Experience information
   */
  const tourTitle =
    experience.title ||
    experience.name ||
    experience.experience_name ||
    experience.experience_title ||
    "Travel Experience";

  const destination =
    experience.destination ||
    experience.location ||
    travelRequest.destination ||
    "Not specified";

  /*
   * Booking information
   */
  const travelDate =
    booking.travel_date ||
    travelRequest.travel_date ||
    null;

  const amount = booking.amount || 0;

  const bookingStatus =
    booking.status || "pending_payment";

  /*
   * Payment information
   */
  const paymentStatus =
    payment.status || "pending";

  /*
   * Request information
   */
  const requestDetails =
    travelRequest.request_details ||
    travelRequest.details ||
    travelRequest.message ||
    "";

  const travelers =
    travelRequest.travelers ||
    travelRequest.number_of_travelers ||
    travelRequest.guests ||
    1;

  /*
   * Actions
   *
   * Accepted booking -> Pay Now
   *
   * Pending travel request -> Cancel Request
   */
  const canCancel =
    travelRequest.status === "pending";

  const canPay =
    bookingStatus === "pending_payment";

  return (
    <div
      className="rb-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="rb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rb-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* ================= HEADER ================= */}

        <div className="rb-modal-head">
          <div className="rb-modal-head-info">

            <div className="rb-logo">
              {getCompanyInitial(companyName)}
            </div>

            <div>
              <h3 id="rb-modal-title">
                {tourTitle}
              </h3>

              <p>
                {companyName}

                {companyRating && (
                  <>
                    {" · "}

                    <FiStar
                      aria-hidden="true"
                      style={{
                        verticalAlign: "-2px",
                      }}
                    />

                    {" "}
                    {companyRating}
                  </>
                )}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="rb-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* ================= BODY ================= */}

        <div className="rb-modal-body">

          {/* Booking Status */}

          <div className="rb-modal-status">
            <span>
              Booking Status
            </span>

            <span className={badgeClass(bookingStatus)}>
              {bookingStatus
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
            </span>
          </div>

          {/* Booking ID */}

          <div className="rb-modal-status">
            <span>
              Booking ID
            </span>

            <span>
              #{booking.id}
            </span>
          </div>

          {/* Booking Details */}

          <div className="rb-modal-grid">

            <div className="rb-modal-field">
              <span>
                Guide
              </span>

              <span>
                {guideName}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Guide Company
              </span>

              <span>
                {companyName}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Tour / Experience
              </span>

              <span>
                {tourTitle}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Destination
              </span>

              <span>
                {destination}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Travel Date
              </span>

              <span>
                {formatDate(travelDate)}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Travelers
              </span>

              <span>
                {travelers}{" "}
                {Number(travelers) === 1
                  ? "Person"
                  : "People"}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Amount
              </span>

              <span>
                ৳{formatAmount(amount)}
              </span>
            </div>

            <div className="rb-modal-field">
              <span>
                Payment Status
              </span>

              <span>
                {paymentStatus
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
              </span>
            </div>

          </div>

          {/* Request Details */}

          {requestDetails && (
            <div className="rb-modal-request-details">
              <span>
                Request Details
              </span>

              <p>
                {requestDetails}
              </p>
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="rb-modal-foot">

          {/* Cancel Request */}

          {canCancel && onCancel && (
            <button
              type="button"
              className="rb-btn rb-btn--danger"
              onClick={() => {
                onCancel(booking.id);
                onClose();
              }}
            >
              <FiXCircle aria-hidden="true" />

              Cancel Request
            </button>
          )}

          {/* Pay Now */}

          {canPay && onPayNow && (
            <button
              type="button"
              className="rb-btn rb-btn--primary"
              onClick={() => {
                onPayNow(booking);
                onClose();
              }}
            >
              <FiCreditCard aria-hidden="true" />

              Pay Now
            </button>
          )}

          {/* Close */}

          <button
            type="button"
            className="rb-btn rb-btn--ghost"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}