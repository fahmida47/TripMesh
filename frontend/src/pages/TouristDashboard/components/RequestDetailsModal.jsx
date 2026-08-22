import { useEffect } from "react";
import { FiX, FiStar, FiXCircle, FiCreditCard } from "react-icons/fi";
import { formatDisplayDate, logoColor } from "../mockRequestsBookings";
import "./RequestsBookings.css";

function badgeClass(status) {
  return `rb-badge rb-badge--${status.toLowerCase().replace(/\s+/g, "")}`;
}

export default function RequestDetailsModal({
  kind,
  item,
  onClose,
  onCancel,
  onProceedToPayment,
  onPayNow,
}) {
  // Close on Escape, and stop the page from scrolling behind the modal.
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  const isRequest = kind === "request";
  const {
    guideName,
    companyName,
    companyRating,
    destination,
    tourType,
    travelers,
    status,
  } = item;

  const canCancel = isRequest && status === "Pending";
  const canPay = isRequest
    ? status === "Accepted"
    : status === "Pending Payment";

  return (
    <div className="rb-modal-backdrop" onClick={onClose}>
      <div
        className="rb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rb-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rb-modal-head">
          <div className="rb-modal-head-info">
            <div
              className="rb-logo"
              style={{ background: logoColor(companyName) }}
            >
              {companyName.charAt(0)}
            </div>
            <div>
              <h3 id="rb-modal-title">
                {isRequest ? item.destination : item.tourTitle}
              </h3>
              <p>
                {companyName} ·{" "}
                <FiStar aria-hidden="true" style={{ verticalAlign: "-2px" }} />{" "}
                {companyRating}
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

        <div className="rb-modal-body">
          <div className="rb-modal-status">
            <span>{isRequest ? "Request Status" : "Booking Status"}</span>
            <span className={badgeClass(status)}>{status}</span>
          </div>

          <div className="rb-modal-grid">
            <div className="rb-modal-field">
              <span>Guide</span>
              <span>{guideName}</span>
            </div>
            <div className="rb-modal-field">
              <span>Guide Company</span>
              <span>{companyName}</span>
            </div>
            <div className="rb-modal-field">
              <span>Destination</span>
              <span>{destination}</span>
            </div>
            <div className="rb-modal-field">
              <span>Tour Type</span>
              <span>{tourType}</span>
            </div>
            <div className="rb-modal-field">
              <span>Travelers</span>
              <span>
                {travelers} {travelers === 1 ? "Person" : "People"}
              </span>
            </div>

            {isRequest ? (
              <>
                <div className="rb-modal-field">
                  <span>Requested Date</span>
                  <span>{formatDisplayDate(item.requestedDate)}</span>
                </div>
                <div className="rb-modal-field">
                  <span>Budget</span>
                  <span>৳{item.budget.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="rb-modal-field">
                  <span>Tour Title</span>
                  <span>{item.tourTitle}</span>
                </div>
                <div className="rb-modal-field">
                  <span>Booking Date</span>
                  <span>{formatDisplayDate(item.bookingDate)}</span>
                </div>
                <div className="rb-modal-field">
                  <span>Amount</span>
                  <span>৳{item.amount.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rb-modal-foot">
          {canCancel && (
            <button
              type="button"
              className="rb-btn rb-btn--danger"
              onClick={() => {
                onCancel(item.id);
                onClose();
              }}
            >
              <FiXCircle aria-hidden="true" /> Cancel Request
            </button>
          )}

          {canPay && (
            <button
              type="button"
              className="rb-btn rb-btn--primary"
              onClick={() => {
                (isRequest ? onProceedToPayment : onPayNow)?.(item);
                onClose();
              }}
            >
              <FiCreditCard aria-hidden="true" />{" "}
              {isRequest ? "Proceed to Payment" : "Pay Now"}
            </button>
          )}

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
