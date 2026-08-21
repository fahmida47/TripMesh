import { FiCheck } from "react-icons/fi";
import { BkashIcon, NagadIcon } from "./PaymentMethodIcons";

// Only bKash and Nagad for now — Bank Transfer has been removed on request.
export const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", hint: "Pay with bKash", Icon: BkashIcon },
  { id: "nagad", label: "Nagad", hint: "Pay with Nagad", Icon: NagadIcon },
];

/**
 * Step 1 of the payment page — lets the tourist pick bKash or Nagad.
 * Fully controlled: `method` is the selected id, `onChange` reports clicks.
 */
export default function PaymentMethodSelector({ method, onChange }) {
  return (
    <section className="cp-section">
      <h2>
        <span className="cp-step">1</span> Choose a Payment Method
      </h2>

      <div className="cp-methods" role="radiogroup" aria-label="Payment method">
        {PAYMENT_METHODS.map(({ id, label, hint, Icon }) => {
          const active = id === method;
          return (
            <button
              type="button"
              key={id}
              role="radio"
              aria-checked={active}
              className={`cp-method${active ? " cp-method--active" : ""}`}
              onClick={() => onChange(id)}
            >
              {active && (
                <span className="cp-method-check">
                  <FiCheck aria-hidden="true" />
                </span>
              )}
              <span className="cp-method-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="cp-method-label">{label}</span>
              <span className="cp-method-hint">{hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
