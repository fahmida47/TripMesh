import { FiSmartphone, FiCalendar, FiShield, FiSend } from "react-icons/fi";

/**
 * Steps 2 & 3 of the payment page — account number + date/time for the
 * chosen method, then the confirm checkbox and Submit button.
 * Fully controlled by the parent (PaymentPage) so it can validate and
 * gather the values on submit.
 */
export default function PaymentForm({
  methodLabel,
  accountNumber,
  onAccountNumberChange,
  paymentDateTime,
  onPaymentDateTimeChange,
  confirmed,
  onConfirmedChange,
  canSubmit,
  submitting,
}) {
  return (
    <>
      <section className="cp-section">
        <h2>
          <span className="cp-step">2</span> Payment Details ({methodLabel})
        </h2>

        <p className="cp-note cp-note--info">
          You will be redirected to {methodLabel} to complete the payment securely.
          After successful payment, please submit the payment information.
        </p>

        <div className="cp-field">
          <label htmlFor="cp-account-number">{methodLabel} Number</label>
          <div className="cp-input">
            <FiSmartphone aria-hidden="true" />
            <input
              id="cp-account-number"
              type="tel"
              inputMode="numeric"
              placeholder="Enter your number (e.g. 01XXXXXXXXX)"
              value={accountNumber}
              onChange={(e) => onAccountNumberChange(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="cp-field">
          <label htmlFor="cp-datetime">Payment Date &amp; Time</label>
          <div className="cp-input">
            <FiCalendar aria-hidden="true" />
            <input
              id="cp-datetime"
              type="datetime-local"
              value={paymentDateTime}
              onChange={(e) => onPaymentDateTimeChange(e.target.value)}
              required
            />
          </div>
        </div>

        <p className="cp-note cp-note--warning">
          <FiShield aria-hidden="true" /> Make sure the {methodLabel} number is correct.
          Wrong information may cause payment verification failure.
        </p>
      </section>

      <section className="cp-section">
        <h2>
          <span className="cp-step">3</span> Submit Payment
        </h2>

        <label className="cp-checkbox">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
          />
          I have completed the payment and the above information is correct.
        </label>

        <button type="submit" className="cp-submit" disabled={!canSubmit || submitting}>
          <FiSend aria-hidden="true" /> Submit Payment
        </button>
      </section>
    </>
  );
}
