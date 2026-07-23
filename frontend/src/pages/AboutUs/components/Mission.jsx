const stats = [
  {
    key: "companies",
    value: "500+",
    label: "Active Guide Companies",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle
          cx="16"
          cy="8"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 20c0-2.8 1.8-5.2 4.3-5.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    key: "travelers",
    value: "10K+",
    label: "Happy Travelers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3 4 8v8l8 5 8-5V8l-8-5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 12v9M4 8l8 4 8-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "destinations",
    value: "120+",
    label: "Destinations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "rating",
    value: "4.8/5",
    label: "Average Rating",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5-4.7-4.6 6.5-.9L12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function Mission() {
  return (
    <div className="tm-mission-col">
      <span className="tm-mission-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </span>

      <p className="tm-eyebrow">OUR MISSION</p>
      <h2>Empowering Local. Enriching Travel.</h2>
      <p className="tm-mission-text">
        Our mission is to empower local guide service companies and create
        unforgettable travel experiences for tourists. We believe travel
        should support local communities and create lasting connections.
      </p>

      <div className="tm-stats-row">
        {stats.map((s) => (
          <div className="tm-stat" key={s.key}>
            <span className="tm-stat-icon">{s.icon}</span>
            <div>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mission;
