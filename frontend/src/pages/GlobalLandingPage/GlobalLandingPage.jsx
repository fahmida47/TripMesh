import Navbar from "../../components/Navbar/Navbar";
import heroImage from "../../assets/tripmesh-hero.png";
import "./GlobalLandingPage.css";

/* Location icon */
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

/* Shield icon */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
    <path d="m8.5 12 2.2 2.2 4.8-5" />
  </svg>
);

/* Star icon */
const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
  </svg>
);

/* Feature component */
function FeatureItem({ icon, title, subtitle }) {
  return (
    <div className="tm-feature">
      <div className="tm-feature__icon">{icon}</div>

      <div className="tm-feature__text">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function GlobalLandingPage() {
  return (
    <main
      className="tm-landing"
      style={{ "--tm-hero-image": `url(${heroImage})` }}
    >
      <section className="tm-hero" id="home">
        <Navbar />

        <div className="tm-hero__inner">
          {/* Left content */}
          <div className="tm-hero__content">
            <h1>
              Your Journey,
              <br />
              <span>Connected</span> Locally.
            </h1>

            <p className="tm-hero__description">
              TripMesh connects travelers with trusted local guides,
              <br className="tm-desktop-break" />
              unique experiences, and real-time offers — all in one place.
            </p>

            {/* Features */}
            <div className="tm-features">
              <FeatureItem
                icon={<LocationIcon />}
                title="Real-time"
                subtitle="Matching"
              />

              <FeatureItem
                icon={<ShieldIcon />}
                title="Trusted"
                subtitle="Local Experts"
              />

              <FeatureItem
                icon={<StarIcon />}
                title="Personalized"
                subtitle="Experiences"
              />
            </div>
          </div>

          {/* Right visual section */}
          <div className="tm-hero__visual" aria-hidden="true">
            <svg
              className="tm-nearby-route"
              viewBox="0 0 300 170"
              preserveAspectRatio="none"
            >
              <path d="M35 145 C78 38, 175 31, 236 55" />
              <circle cx="35" cy="145" r="5" />
            </svg>

            <div className="tm-nearby-card">
              <div className="tm-nearby-card__icon">
                <LocationIcon />
              </div>

              <div>
                <strong>Explore Nearby</strong>
                <span>120+ experiences</span>
                <span>near you</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GlobalLandingPage;