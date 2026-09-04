import {
  FiEye,
  FiXCircle,
  FiCreditCard,
  FiStar,
  FiMapPin,
} from "react-icons/fi";

import "./RequestsBookings.css";

function formatDisplayDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function logoColor(name) {
  const colors = [
    "#4F46E5",
    "#0891B2",
    "#059669",
    "#D97706",
    "#DC2626",
    "#7C3AED",
  ];

  if (!name) {
    return colors[0];
  }

  let total = 0;

  for (let i = 0; i < name.length; i++) {
    total += name.charCodeAt(i);
  }

  return colors[total % colors.length];
}

function badgeClass(status) {
  if (!status) {
    return "rb-badge";
  }

  const formattedStatus = status
    .toLowerCase()
    .replace(/[_\s]+/g, "");

  return `rb-badge rb-badge--${formattedStatus}`;
}

function displayStatus(status) {
  if (!status) {
    return "—";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function TouristRequestCard({
  request,
  onViewDetails,
  onCancel,
  onProceedToPayment,
}) {
  /*
  |--------------------------------------------------------------------------
  | Backend booking data
  |--------------------------------------------------------------------------
  */

  const booking = request;

  const guideProfile = booking?.guide;
  const guideUser = guideProfile?.user;
  const experience = booking?.experience;
  const travelRequest = booking?.travelRequest;
  const payment = booking?.payment;

  /*
  |--------------------------------------------------------------------------
  | Guide information
  |--------------------------------------------------------------------------
  */

  const guideName =
    guideUser?.name ||
    guideUser?.full_name ||
    guideUser?.fullName ||
    guideProfile?.name ||
    "Guide";

  const companyName =
    guideProfile?.company_name ||
    guideProfile?.companyName ||
    guideProfile?.business_name ||
    "Guide";

  const companyRating =
    guideProfile?.rating ||
    guideProfile?.average_rating ||
    null;

  /*
  |--------------------------------------------------------------------------
  | Experience information
  |--------------------------------------------------------------------------
  */

  const tourType =
    experience?.title ||
    experience?.name ||
    experience?.experience_name ||
    experience?.experience_title ||
    "Travel Experience";

  const destination =
    experience?.destination ||
    experience?.location ||
    travelRequest?.destination ||
    null;

  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  const requestedDate =
    booking?.travel_date ||
    travelRequest?.travel_date ||
    null;

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  |
  | Backend status is used directly.
  |
  | Booking:
  | pending_payment
  | confirmed
  | cancelled
  |
  | Travel Request:
  | pending
  | accepted
  | rejected
  | cancelled
  |--------------------------------------------------------------------------
  */

  const bookingStatus = booking?.status;

  const requestStatus = travelRequest?.status;

  const status = bookingStatus || requestStatus || "";

  /*
  |--------------------------------------------------------------------------
  | Actions
  |--------------------------------------------------------------------------
  */

  const canCancel =
    requestStatus === "pending";

  const canPay =
    bookingStatus === "pending_payment";

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <article className="rb-row">
      {/* GUIDE / GUIDE COMPANY */}

      <div className="rb-cell rb-cell--company">
        <span className="rb-cell-label">
          Guide / Guide Company
        </span>

        <div className="rb-company">
          <div
            className="rb-logo"
            style={{
              background: logoColor(companyName),
            }}
          >
            {companyName?.charAt(0)?.toUpperCase()}
          </div>

          <div className="rb-company-info">
            <p className="rb-company-name">
              {companyName}
            </p>

            {guideName && (
              <span className="rb-guide-name">
                {guideName}
              </span>
            )}

            {companyRating && (
              <span className="rb-rating">
                <FiStar aria-hidden="true" />{" "}
                {companyRating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TOUR / EXPERIENCE */}

      <div className="rb-cell rb-cell--tour">
        <span className="rb-cell-label">
          Tour / Experience
        </span>

        <p className="rb-tour-name">
          {tourType}
        </p>

        {destination && (
          <span className="rb-destination">
            <FiMapPin aria-hidden="true" />{" "}
            {destination}
          </span>
        )}
      </div>

      {/* DATE */}

      <div className="rb-cell rb-cell--date">
        <span className="rb-cell-label">
          Date
        </span>

        <span className="rb-date">
          {formatDisplayDate(requestedDate)}
        </span>
      </div>

      {/* STATUS */}

      <div className="rb-cell rb-cell--status">
        <span className="rb-cell-label">
          Status
        </span>

        <span className={badgeClass(status)}>
          {displayStatus(status)}
        </span>
      </div>

      {/* ACTION */}

      <div className="rb-cell rb-cell--actions">
        <span className="rb-cell-label">
          Action
        </span>

        <div className="rb-actions">
          {/* View Details */}

          <button
            type="button"
            className="rb-btn rb-btn--ghost"
            onClick={() =>
              onViewDetails?.(booking)
            }
          >
            <FiEye aria-hidden="true" />
            View Details
          </button>

          {/* Cancel */}

          {canCancel && (
            <button
              type="button"
              className="rb-btn rb-btn--danger"
              onClick={() =>
                onCancel?.(booking.id)
              }
            >
              <FiXCircle aria-hidden="true" />
              Cancel Request
            </button>
          )}

          {/* Pay Now */}

          {canPay && (
            <button
              type="button"
              className="rb-btn rb-btn--primary"
              onClick={() =>
                onProceedToPayment?.(booking)
              }
            >
              <FiCreditCard aria-hidden="true" />
              Pay Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}