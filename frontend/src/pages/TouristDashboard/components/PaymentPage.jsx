import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

import PaymentMethodSelector, { PAYMENT_METHODS } from "./PaymentMethodSelector";
import PaymentForm from "./PaymentForm";
import PaymentBookingSummary from "./PaymentBookingSummary";
import PaymentSuccess from "./PaymentSuccess";

import "./PaymentPage.css";

/**
 * Full-page "Complete Your Payment" screen, opened when the tourist clicks
 * "Pay Now" / "Proceed to Payment" on a specific request or payment.
 *
 * `booking` is whatever request/payment object triggered the flow. This
 * component only owns the payment-form state (method, account number,
 * date/time, confirmation, and whether it's been submitted) — the booking
 * details display lives in PaymentBookingSummary, which reads straight from
 * `booking` with no mock data of its own.
 */
export default function PaymentPage({ booking, backLabel = "Back to My Requests", onBack, onSubmit }) {
  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [paymentDateTime, setPaymentDateTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const methodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label;
  const canSubmit = confirmed && accountNumber.trim() !== "" && paymentDateTime !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    onSubmit?.({
      bookingId: booking?.id,
      method,
      accountNumber,
      paymentDateTime,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="cp-page">
        <PaymentSuccess
          booking={booking}
          method={methodLabel}
          accountNumber={accountNumber}
          backLabel={backLabel}
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <div className="cp-page">
      <button type="button" className="cp-back" onClick={onBack}>
        <FiArrowLeft aria-hidden="true" /> {backLabel}
      </button>

      <div className="cp-header">
        <h1>Complete Your Payment</h1>
        <p>Please complete your payment to confirm your booking.</p>
      </div>

      <form className="cp-grid" onSubmit={handleSubmit}>
        <div className="cp-main">
          <PaymentMethodSelector method={method} onChange={setMethod} />

          <PaymentForm
            methodLabel={methodLabel}
            accountNumber={accountNumber}
            onAccountNumberChange={setAccountNumber}
            paymentDateTime={paymentDateTime}
            onPaymentDateTimeChange={setPaymentDateTime}
            confirmed={confirmed}
            onConfirmedChange={setConfirmed}
            canSubmit={canSubmit}
            submitting={submitting}
          />
        </div>

        <PaymentBookingSummary booking={booking} />
      </form>
    </div>
  );
}
