import { useState } from "react";
import { FiX, FiCreditCard, FiLock } from "react-icons/fi";

/**
 * "Pay Now" payment form modal, opened from the Pay Now card on the
 * Payments overview. This is UI-only for now — Submit just reports the
 * values back to the parent (via onSubmit) and closes. Wiring it up to an
 * actual payment gateway is a follow-up.
 */
export default function PaymentFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose();
  };

  return (
    <div className="pm-modal-backdrop" onClick={onClose}>
      <div
        className="pm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-form-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-modal-head">
          <div className="pm-modal-head-info">
            <div className="pm-modal-icon">
              <FiCreditCard aria-hidden="true" />
            </div>
            <div>
              <h3 id="pm-form-modal-title">Pay Now</h3>
              <p>Enter your card details to continue</p>
            </div>
          </div>
          <button type="button" className="pm-modal-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pm-modal-body">
            <div className="pm-form-field">
              <label htmlFor="pm-card-name">Name on Card</label>
              <input
                id="pm-card-name"
                type="text"
                placeholder="Ahona Ahmed"
                value={form.cardName}
                onChange={handleChange("cardName")}
                required
              />
            </div>

            <div className="pm-form-field">
              <label htmlFor="pm-card-number">Card Number</label>
              <input
                id="pm-card-number"
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={form.cardNumber}
                onChange={handleChange("cardNumber")}
                required
              />
            </div>

            <div className="pm-form-row">
              <div className="pm-form-field">
                <label htmlFor="pm-expiry">Expiry Date</label>
                <input
                  id="pm-expiry"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={form.expiry}
                  onChange={handleChange("expiry")}
                  required
                />
              </div>

              <div className="pm-form-field">
                <label htmlFor="pm-cvv">CVV</label>
                <input
                  id="pm-cvv"
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={form.cvv}
                  onChange={handleChange("cvv")}
                  required
                />
              </div>
            </div>

            <div className="pm-form-field">
              <label htmlFor="pm-amount">Amount (৳)</label>
              <input
                id="pm-amount"
                type="number"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange("amount")}
                required
              />
            </div>

            <p className="pm-form-secure">
              <FiLock aria-hidden="true" /> Your payment details are encrypted and secure.
            </p>
          </div>

          <div className="pm-modal-foot">
            <button type="button" className="pm-btn pm-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pm-btn pm-btn--primary">
              <FiCreditCard aria-hidden="true" /> Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
