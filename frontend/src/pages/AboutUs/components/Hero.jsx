import heroImage from "../../../assets/aboutus.jpeg";

function Hero() {
  return (
    <section className="tm-about-hero">
      <div className="tm-about-left">
        <span className="tm-about-small">ABOUT TRIPMESH</span>

        <h1>
          Connecting Travelers
          <br />
          with <span className="tm-highlight">Local Experiences</span>
        </h1>

        <p>
          TripMesh is a real-time marketplace that connects travelers with
          trusted guide service companies, local experts, and authentic
          experiences around the world.
        </p>

        <p>
          We make travel more meaningful by bringing the right people
          together at the right time.
        </p>
      </div>

      <div className="tm-about-right">
        <div className="tm-image-card">
          <img src={heroImage} alt="Travelers looking at a mountain lake" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
