import { useState } from "react";
import {
  User,
  Mail,
  FileText,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";

import "./ContactForm.css";

const ContactForm = () => {
  const initialForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      setSuccess("");

      return;
    }

    setSuccess(
      "Thank you for contacting TripMesh. We will respond within 24 hours.",
    );

    setFormData(initialForm);

    setErrors({});
  };

  return (
    <div className="contact-form-card">
      <h2>Send Us a Message</h2>

      <div className="title-line"></div>

      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <div className="input-group">
            <User />

            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              aria-label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {errors.name && <p className="error">{errors.name}</p>}

          <div className="input-group">
            <Mail />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              aria-label="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <FileText />

          <input
            type="text"
            name="subject"
            placeholder="Subject *"
            aria-label="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        {errors.subject && <p className="error">{errors.subject}</p>}

        <div className="input-group textarea-box">
          <MessageSquare />

          <textarea
            name="message"
            placeholder="Your Message *"
            aria-label="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {errors.message && <p className="error">{errors.message}</p>}

        <button type="submit">
          <Send size={18} />
          Send Message
        </button>

        <p className="privacy">
          <ShieldCheck size={16} />
          We respect your privacy. Your information is safe with us.
        </p>

        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
