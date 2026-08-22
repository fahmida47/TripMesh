import { FiCheck } from "react-icons/fi";
import { BkashIcon, NagadIcon } from "./PaymentMethodIcons";

export const PAYMENT_METHODS = [
  {
    id: "bkash",
    hint: "Pay with bKash",
    Icon: BkashIcon,
  },
  {
    id: "nagad",
    hint: "Pay with Nagad",
    Icon: NagadIcon,
  },
];

export default function PaymentMethodSelector({ method, onChange }) {
  return (
    <section className="cp-section">
      <h2>
        <span className="cp-step">1</span>
        Choose a Payment Method
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
              className={`cp-method ${active ? "cp-method--active" : ""}`}
              onClick={() => onChange(id)}
            >
              {active && (
                <span className="cp-method-check">
                  <FiCheck aria-hidden="true" />
                </span>
              )}

              {/* FULL LOGO AREA */}
              <span className="cp-method-icon">
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
