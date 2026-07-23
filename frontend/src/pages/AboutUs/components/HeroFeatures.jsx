const icons = {
  travelers: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.6" />
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
        opacity="0.6"
      />
    </svg>
  ),
  guides: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3"
        y="8"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M3 13h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  secure: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  global: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
};

const features = [
  {
    key: "travelers",
    title: "For Travelers",
    text: "Find trusted guides and unique experiences tailored to you.",
  },
  {
    key: "guides",
    title: "For Guide Companies",
    text: "Grow your business and reach more travelers in real-time.",
  },
  {
    key: "secure",
    title: "Secure & Reliable",
    text: "Safe payments, verified companies, and reliable support.",
  },
  {
    key: "global",
    title: "Global Community",
    text: "Building a community of travelers and locals worldwide.",
  },
];

function HeroFeatures() {
  return (
    <div className="tm-hero-features">
      {features.map((f) => (
        <div className="tm-hero-feature-card" key={f.key}>
          <span className="tm-hero-feature-icon">{icons[f.key]}</span>
          <div>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroFeatures;
