const points = [
  "Verified and trusted guide service companies",
  "Real-time booking requests and offers",
  "Transparent pricing and secure payments",
  "Authentic experiences and local insights",
  "24/7 support for a worry-free journey",
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="m8.5 12.5 2.3 2.3L16 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function WhyChoose() {
  return (
    <div className="tm-why-card">
      <p className="tm-eyebrow">WHY CHOOSE TRIPMESH?</p>

      <ul className="tm-why-list">
        {points.map((point) => (
          <li key={point}>
            <span className="tm-why-check">
              <CheckIcon />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WhyChoose;
