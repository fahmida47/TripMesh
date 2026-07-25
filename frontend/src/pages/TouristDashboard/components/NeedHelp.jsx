import { FiHeadphones } from "react-icons/fi";
import "./NeedHelp.css";

export default function NeedHelp() {
  return (
    <section className="ts-need-help" aria-label="Need help">
      <span className="ts-need-help-icon">
        <FiHeadphones aria-hidden="true" />
      </span>
      <h3>Need Help?</h3>
      <p>We're here for you</p>
      <button type="button" className="ts-need-help-btn">
        Contact Support
      </button>
    </section>
  );
}
