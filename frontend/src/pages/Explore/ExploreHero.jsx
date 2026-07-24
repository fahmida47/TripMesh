import Navbar from "../../components/Navbar/Navbar";
import exploreHero from "../../assets/explore-hero.png";

function ExploreHero() {
  return (
    <section
      className="explore-top-section"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(2, 20, 55, 0.96) 0%,
            rgba(2, 29, 70, 0.82) 42%,
            rgba(3, 39, 79, 0.22) 100%
          ),
          url(${exploreHero})
        `,
      }}
    >
      <Navbar />

      <div className="explore-hero-content">
        <h1>Explore Guide Services in Bangladesh</h1>

        <p>
          Find and connect with professional local guide companies
          <br />
          for your next unforgettable journey.
        </p>
      </div>
    </section>
  );
}

export default ExploreHero;