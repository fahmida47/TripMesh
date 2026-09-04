import { FiEye, FiXCircle, FiCreditCard, FiStar, FiMapPin } from "react-icons/fi";
import { formatDisplayDate, logoColor } from "../mockRequestsBookings";
import "./RequestsBookings.css";

// "Pending Payment" -> "rb-badge--pendingpayment"
function badgeClass(status) {
  return `rb-badge rb-badge--${status.toLowerCase().replace(/\s+/g, "")}`;
}

export default function TouristRequestCard({ request, onViewDetails, onCancel, onProceedToPayment }) {
  const {
    companyName,
    companyRating,
    guideName,
    tourType,
    destination,
    requestedDate,
    status,
  } = request;

  const canCancel = status === "Pending";
  const canPay = status === "Accepted";

  return (
    <article className="rb-row">
      {/* GUIDE / GUIDE COMPANY */}
      <div className="rb-cell rb-cell--company">
        <span className="rb-cell-label">Guide / Guide Company</span>
        <div className="rb-company">
          <div className="rb-logo" style={{ background: logoColor(companyName) }}>
            {companyName?.charAt(0)}
          </div>
          <div className="rb-company-info">
            <p className="rb-company-name">{companyName}</p>
            {guideName && <span className="rb-guide-name">{guideName}</span>}
            {companyRating && (
              <span className="rb-rating">
                <FiStar aria-hidden="true" /> {companyRating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TOUR / EXPERIENCE */}
      <div className="rb-cell rb-cell--tour">
        <span className="rb-cell-label">Tour / Experience</span>
        <p className="rb-tour-name">{tourType}</p>
        {destination && (
          <span className="rb-destination">
            <FiMapPin aria-hidden="true" /> {destination}
          </span>
        )}
      </div>

      {/* DATE */}
      <div className="rb-cell rb-cell--date">
        <span className="rb-cell-label">Date</span>
        <span className="rb-date">
          {requestedDate ? formatDisplayDate(requestedDate) : "—"}
        </span>
      </div>

      {/* STATUS */}
      <div className="rb-cell rb-cell--status">
        <span className="rb-cell-label">Status</span>
        <span className={badgeClass(status)}>{status}</span>
      </div>

      {/* ACTION */}
      <div className="rb-cell rb-cell--actions">
        <span className="rb-cell-label">Action</span>
        <div className="rb-actions">
          <button type="button" className="rb-btn rb-btn--ghost" onClick={() => onViewDetails(request)}>
            <FiEye aria-hidden="true" /> View Details
          </button>

          {canCancel && (
            <button type="button" className="rb-btn rb-btn--danger" onClick={() => onCancel(request.id)}>
              <FiXCircle aria-hidden="true" /> Cancel Request
            </button>
          )}

          {canPay && (
            <button type="button" className="rb-btn rb-btn--primary" onClick={() => onProceedToPayment(request)}>
              <FiCreditCard aria-hidden="true" /> Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
