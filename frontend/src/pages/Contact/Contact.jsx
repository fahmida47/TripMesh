import "./Contact.css";
import contactBg from "../../assets/contact-bg.jpg";
import Navbar from "../../components/Navbar/Navbar";
import ContactInformation from "./components/ContactInformation";
import ContactForm from "./components/ContactForm";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${contactBg})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Contact Us</h1>

          <p>
            Have a question, suggestion, or need support?
            <br />
            We’re here to help and make your TripMesh
            <br />
            experience amazing.
          </p>

          <div className="plane-icon">✈</div>
        </div>
      </section>

      <section className="contact-container">
        <ContactInformation />

        <ContactForm />
      </section>
    </div>
  );
};

export default Contact;