import bkashLogo from "../../../assets/bkash.jpg";
import nagadLogo from "../../../assets/nagad.jpg";

export function BkashIcon() {
  return <img src={bkashLogo} alt="bKash" className="payment-brand-logo" />;
}

export function NagadIcon() {
  return <img src={nagadLogo} alt="Nagad" className="payment-brand-logo" />;
}
