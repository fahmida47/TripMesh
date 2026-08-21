import { FiEye, FiCreditCard, FiMapPin } from "react-icons/fi";

// "Held by Admin" -> "pm-badge--heldbyadmin"
function badgeClass(status) {
  return `pm-badge pm-badge--${status.toLowerCase().replace(/\s+/g, "")}`;
}

/**
 * One row/card in the Payment History table. Purely presentational —
 * actions are forwarded to the parent via callbacks, same pattern as
 * TouristRequestCard.jsx.
 *
 * "Pay Now" only shows up for a Pending payment (matches the reference
 * design). Wiring it up to an actual payment flow is a follow-up — for now
 * it just reports the click back to PaymentHistory.
 */
export default function PaymentCard({ payment, onViewDetails, onPayNow }) {
  const { tourName, companyName, destination, date, status } = payment;
  const canPay = status === "Pending";

  return (
    <article className="pm-row">
      <div className="pm-cell pm-cell--tour">
        <span className="pm-cell-label">Tour & Company</span>
        <div className="pm-tour">
          <div className="pm-thumb" aria-hidden="true" />
          <div>
            <p className="pm-tour-name">{tourName}</p>
            <span className="pm-company-name">{companyName}</span>
          </div>
        </div>
      </div>

      <div className="pm-cell">
        <span className="pm-cell-label">Destination</span>
        <span className="pm-destination">
          <FiMapPin aria-hidden="true" /> {destination}
        </span>
      </div>

      <div className="pm-cell">
        <span className="pm-cell-label">Payment Date</span>
        <span className="pm-date">{date || "—"}</span>
      </div>

      <div className="pm-cell">
        <span className="pm-cell-label">Status</span>
        <span className={badgeClass(status)}>{status}</span>
      </div>

      <div className="pm-cell pm-cell--actions">
        <div className="pm-actions">
          {canPay && (
            <button type="button" className="pm-btn pm-btn--primary" onClick={() => onPayNow(payment)}>
              <FiCreditCard aria-hidden="true" /> Pay Now
            </button>
          )}

          <button type="button" className="pm-btn pm-btn--ghost" onClick={() => onViewDetails(payment)}>
            <FiEye aria-hidden="true" /> View Details
          </button>
        </div>
      </div>
    </article>
  );
}
