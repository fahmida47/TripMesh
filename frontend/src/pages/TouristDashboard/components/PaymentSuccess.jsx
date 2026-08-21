import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return "—";
  return `৳${Number(value).toLocaleString()}`;
}

/**
 * Shown in place of the form once Submit Payment succeeds. Keeps the same
 * card layout as the rest of the page, just swaps the steps for a
 * confirmation state. `booking`/`method`/`accountNumber` are only used to
 * recap what was submitted — no invented data.
 */
export default function PaymentSuccess({ booking, method, accountNumber, backLabel, onBack }) {
  const tourName = booking?.tourTitle || booking?.tourName || booking?.destination;
  const amount = booking?.budget ?? booking?.amount ?? booking?.tourPrice;

  return (
    <div className="cp-success">
      <div className="cp-success-icon">
        <FiCheckCircle aria-hidden="true" />
      </div>

      <h2>Payment Completed!</h2>
      <p>
        Your {method} payment has been submitted successfully. We&apos;ll verify it and
        confirm your booking shortly.
      </p>

      <div className="cp-success-recap">
        {tourName && (
          <div className="cp-summary-row">
            <span>Tour</span>
            <span>{tourName}</span>
          </div>
        )}
        {amount !== undefined && (
          <div className="cp-summary-row">
            <span>Amount</span>
            <span>{formatMoney(amount)}</span>
          </div>
        )}
        {accountNumber && (
          <div className="cp-summary-row">
            <span>{method} Number</span>
            <span>{accountNumber}</span>
          </div>
        )}
      </div>

      <button type="button" className="cp-back cp-success-back" onClick={onBack}>
        <FiArrowLeft aria-hidden="true" /> {backLabel}
      </button>
    </div>
  );
}
