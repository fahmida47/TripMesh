const requests = [
  ["Pending", "8 (25%)", "pending"],
  ["Accepted", "16 (50%)", "accepted"],
  ["Completed", "6 (19%)", "completed"],
  ["Rejected", "2 (6%)", "rejected"],
];

const RequestsOverview = () => (
  <article className="overview-card requests-overview">
    <div className="overview-card__heading">
      <h2>Requests Overview</h2><button type="button">This Month <FiChevronDown aria-hidden="true" /></button>
    </div>
    <div className="request-summary">
      <div className="request-donut" aria-label="32 total requests"><div><strong>32</strong><span>Total</span></div></div>
      <ul className="request-legend">
        {requests.map(([label, value, tone]) => <li key={label}><span className={`legend-dot legend-dot--${tone}`} />{label}<b>{value}</b></li>)}
      </ul>
    </div>
  </article>
);
export default RequestsOverview;
import { FiChevronDown } from "react-icons/fi";
