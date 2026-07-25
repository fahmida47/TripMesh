import React from "react";
import "./Contact.css";
import contactBg from "../../assets/contact-bg.jpg";
import Navbar from "../../components/Navbar/Navbar";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock3,
  Send,
  ShieldCheck,
} from "lucide-react";
import ContactInformation from "./components/ContactInformation";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />
      {/* Hero Section */}
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

      {/* Main Contact Layout */}
      <section className="contact-container">
        {/* Left Contact Information */}
        <ContactInformation />
        {/* Right Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <div className="title-line"></div>

          <form>
            <div className="form-row">
              <input type="text" placeholder="Full Name *" />

              <input type="email" placeholder="Email Address *" />
            </div>

            <input type="text" placeholder="Subject *" />

            <textarea placeholder="Your Message *"></textarea>

            <button>
              <Send size={18} />
              Send Message
            </button>

            <p className="privacy">
              <ShieldCheck size={16} />
              We respect your privacy. Your information is safe with us.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
