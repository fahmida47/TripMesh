const requests = [
  ["John Smith", "Cox's Bazar, Bangladesh", "Pending", "27 July 2026", "JS"],
  ["Emma Johnson", "Sylhet, Bangladesh", "Pending", "26 July 2026", "EJ"],
  ["David Lee", "Sundarbans, Bangladesh", "Accepted", "25 July 2026", "DL"],
  ["Maria Garcia", "Bandarban, Bangladesh", "Pending", "25 July 2026", "MG"],
  ["Alex Brown", "Dhaka City Tour", "Accepted", "24 July 2026", "AB"],
];
const RecentRequests = () => <article className="overview-card recent-requests">
  <div className="overview-card__heading"><h2>Recent Requests</h2><a href="#requests">View All</a></div>
  <div className="request-list">{requests.map(([name, tour, status, date, initials]) => <div className="request-row" key={name}>
    <span className="avatar">{initials}</span><div className="request-row__details"><b>{name}</b><span>⌾ {tour}</span></div>
    <div className="request-row__status"><em className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</em><small>{date}</small></div>
  </div>)}</div>
</article>;
export default RecentRequests;
