import { useEffect } from "react";
import { FiX, FiCreditCard, FiMapPin } from "react-icons/fi";

function badgeClass(status) {
  return `pm-badge pm-badge--${status.toLowerCase().replace(/\s+/g, "")}`;
}

export default function PaymentDetailsModal({ payment, onClose, onPayNow }) {
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

  if (!payment) return null;

  const { tourName, companyName, destination, date, status, transactionId } =
    payment;
  const canPay = status === "Pending";

  return (
    <div className="pm-modal-backdrop" onClick={onClose}>
      <div
        className="pm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-modal-head">
          <div className="pm-modal-head-info">
            <div className="pm-thumb" aria-hidden="true" />
            <div>
              <h3 id="pm-modal-title">{tourName}</h3>
              <p>{companyName}</p>
            </div>
          </div>
          <button
            type="button"
            className="pm-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="pm-modal-body">
          <div className="pm-modal-status">
            <span>Payment Status</span>
            <span className={badgeClass(status)}>{status}</span>
          </div>

          <div className="pm-modal-grid">
            <div className="pm-modal-field">
              <span>Guide Company</span>
              <span>{companyName}</span>
            </div>
            <div className="pm-modal-field">
              <span>Destination</span>
              <span>
                <FiMapPin
                  aria-hidden="true"
                  style={{ verticalAlign: "-2px" }}
                />{" "}
                {destination}
              </span>
            </div>
            <div className="pm-modal-field">
              <span>Payment Date</span>
              <span>{date || "—"}</span>
            </div>
            <div className="pm-modal-field">
              <span>Transaction ID</span>
              <span>{transactionId || "—"}</span>
            </div>
          </div>
        </div>

        <div className="pm-modal-foot">
          {canPay && (
            <button
              type="button"
              className="pm-btn pm-btn--primary"
              onClick={() => {
                onPayNow?.(payment);
                onClose();
              }}
            >
              <FiCreditCard aria-hidden="true" /> Pay Now
            </button>
          )}

          <button
            type="button"
            className="pm-btn pm-btn--ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
