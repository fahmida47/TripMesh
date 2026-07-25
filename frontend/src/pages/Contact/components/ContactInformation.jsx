import { Mail, Phone, MessageCircle, Clock3 } from "lucide-react";

import "./ContactInformation.css";

const ContactInformation = () => {
  return (
    <div className="contact-information">
      <h2>Get in Touch</h2>

      <div className="title-line"></div>

      <div className="contact-item">
        <div className="contact-icon">
          <Mail size={24} />
        </div>

        <div>
          <h3>Email</h3>

          <p>
            support@tripmesh.com
            <br />
            info@tripmesh.com
          </p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <Phone size={24} />
        </div>

        <div>
          <h3>Phone</h3>

          <p>
            +880 1700 123456
            <br />
            Sunday - Thursday, 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <MessageCircle size={24} />
        </div>

        <div>
          <h3>Live Chat</h3>

          <p>
            Chat with our support team
            <br />
            during business hours.
          </p>
        </div>
      </div>

      <div className="contact-item">
        <div className="contact-icon">
          <Clock3 size={24} />
        </div>

        <div>
          <h3>Response Time</h3>

          <p>
            We usually respond
            <br />
            within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
