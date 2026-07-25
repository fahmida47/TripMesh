import { RELATIONSHIP_OPTIONS } from "../mockProfile";

/**
 * Emergency Contact section: contact name, relationship, phone number.
 */
export default function EmergencyContactForm({
  contact,
  errors,
  isEditing,
  onFieldChange,
}) {
  return (
    <section className="tp-card">
      <h3 className="tp-card__title">Emergency Contact</h3>

      <div className="tp-grid">
        <div className="tp-field">
          <label>Contact Name</label>
          {isEditing ? (
            <input
              type="text"
              value={contact.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Full name"
            />
          ) : (
            <p>{contact.name}</p>
          )}
          {errors.name && <span className="tp-error">{errors.name}</span>}
        </div>

        <div className="tp-field">
          <label>Relationship</label>
          {isEditing ? (
            <select
              value={contact.relationship}
              onChange={(e) => onFieldChange("relationship", e.target.value)}
            >
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          ) : (
            <p>{contact.relationship}</p>
          )}
        </div>

        <div className="tp-field">
          <label>Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="+1 210 555 0000"
            />
          ) : (
            <p>{contact.phone}</p>
          )}
          {errors.phone && <span className="tp-error">{errors.phone}</span>}
        </div>
      </div>
    </section>
  );
}
