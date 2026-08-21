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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Remove success message if user starts editing again
    if (success) {
      setSuccess("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Message should be at least 10 characters";
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
      "Thank you for contacting TripMesh. We will respond within 24 hours."
    );

    setFormData(initialForm);
    setErrors({});
  };

  return (
    <div className="contact-form-card">
      <h2>Send Us a Message</h2>

      <div className="title-line"></div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name + Email */}
        <div className="input-row">
          <div className="contact-field">
            <div
              className={`input-group ${
                errors.name ? "input-error" : ""
              }`}
            >
              <User aria-hidden="true" />

              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                aria-label="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {errors.name && (
              <p className="error">{errors.name}</p>
            )}
          </div>

          <div className="contact-field">
            <div
              className={`input-group ${
                errors.email ? "input-error" : ""
              }`}
            >
              <Mail aria-hidden="true" />

              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                aria-label="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="contact-field">
          <div
            className={`input-group ${
              errors.subject ? "input-error" : ""
            }`}
          >
            <FileText aria-hidden="true" />

            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              aria-label="Subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          {errors.subject && (
            <p className="error">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="contact-field">
          <div
            className={`input-group textarea-box ${
              errors.message ? "input-error" : ""
            }`}
          >
            <MessageSquare aria-hidden="true" />

            <textarea
              name="message"
              placeholder="Your Message *"
              aria-label="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              spellCheck="true"
            />
          </div>

          {errors.message && (
            <p className="error">{errors.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="contact-submit-btn"
        >
          <Send size={18} aria-hidden="true" />
          <span>Send Message</span>
        </button>

        {/* Privacy */}
        <p className="privacy">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>
            We respect your privacy. Your information is safe
            with us.
          </span>
        </p>

        {/* Success */}
        {success && (
          <p className="success" role="status">
            {success}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;