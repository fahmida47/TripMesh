import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import PaymentMethodSelector, {
  PAYMENT_METHODS,
} from "./PaymentMethodSelector";
import PaymentForm from "./PaymentForm";
import PaymentBookingSummary from "./PaymentBookingSummary";
import PaymentSuccess from "./PaymentSuccess";
import TouristSidebar from "./TouristSidebar";
import "./PaymentPage.css";

export default function PaymentPage({ booking, backLabel, onBack, onSubmit }) {
  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [paymentDateTime, setPaymentDateTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const methodLabel =
    PAYMENT_METHODS.find((item) => item.id === method)?.label || "bKash";

  const canSubmit =
    confirmed && accountNumber.trim() !== "" && paymentDateTime !== "";

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
      <div className="cp-shell">
        <TouristSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="cp-content">
          <div className="cp-page">
            <PaymentSuccess
              booking={booking}
              method={methodLabel}
              accountNumber={accountNumber}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cp-shell">
      <TouristSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="cp-content">
        <div className="cp-page">
          <div className="cp-header">
            {onBack && (
              <button
                type="button"
                className="cp-back-btn"
                onClick={onBack}
              >
                <FiArrowLeft aria-hidden="true" />
                {backLabel || "Back"}
              </button>
            )}

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
      </main>
    </div>
  );
}
