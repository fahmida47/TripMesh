import { FiEye, FiXCircle, FiCreditCard, FiStar } from "react-icons/fi";
import { logoColor } from "../mockRequestsBookings";
import "./RequestsBookings.css";

// "Pending Payment" -> "rb-badge--pendingpayment"
function badgeClass(status) {
  return `rb-badge rb-badge--${status.toLowerCase().replace(/\s+/g, "")}`;
}

export default function TouristRequestCard({ request, onViewDetails, onCancel, onProceedToPayment }) {
  const { companyName, companyRating, status } = request;

  const canCancel = status === "Pending";
  const canPay = status === "Accepted";

  return (
    <article className="rb-row">
      <div className="rb-cell rb-cell--company">
        <span className="rb-cell-label">Guide Company</span>
        <div className="rb-company">
          <div className="rb-logo" style={{ background: logoColor(companyName) }}>
            {companyName.charAt(0)}
          </div>
          <div>
            <p className="rb-company-name">{companyName}</p>
            <span className="rb-rating">
              <FiStar aria-hidden="true" /> {companyRating}
            </span>
          </div>
        </div>
      </div>

      <div className="rb-cell">
        <span className="rb-cell-label">Status</span>
        <span className={badgeClass(status)}>{status}</span>
      </div>

      <div className="rb-cell rb-cell--actions">
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
