import { FiCheckCircle, FiX } from "react-icons/fi";

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return "—";
  return `৳${Number(value).toLocaleString()}`;
}

export default function PaymentSuccess({
  booking,
  method,
  accountNumber,
  onClose,
}) {
  const tourName =
    booking?.tourTitle || booking?.tourName || booking?.destination;
  const amount = booking?.budget ?? booking?.amount ?? booking?.tourPrice;

  return (
    <div className="cp-success">
      <button
        type="button"
        className="cp-success-close"
        onClick={onClose}
        aria-label="Back to My Requests"
        title="Back to My Requests"
      >
        <FiX aria-hidden="true" />
      </button>

      <div className="cp-success-icon">
        <FiCheckCircle aria-hidden="true" />
      </div>

      <h2>Payment Submitted</h2>
      <p>
        Your {method} payment details are with the admin for verification. Your booking will be confirmed after approval.
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

    </div>
  );
}
