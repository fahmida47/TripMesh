import AboutNavbar from "./components/AboutNavbar";
import Hero from "./components/Hero";
import HeroFeatures from "./components/HeroFeatures";
import Mission from "./components/Mission";
import WhyChoose from "./components/WhyChoose";
import Team from "./components/Team";
import TrustSecurity from "./components/TrustSecurity";
import "./AboutUs.css";

function AboutUs() {
  return (
    <main className="tm-about-page">
      <div className="tm-hero-banner">
        <AboutNavbar />
        <Hero />
        <HeroFeatures />
      </div>

      <section className="tm-mission-section">
        <Mission />
        <WhyChoose />
      </section>

      <section className="tm-team-banner">
        <Team />
        <TrustSecurity />
      </section>
    </main>
  );
}

export default AboutUs;
