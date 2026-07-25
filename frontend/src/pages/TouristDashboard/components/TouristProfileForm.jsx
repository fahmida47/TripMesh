/**
 * Personal Information section: full name, email, phone, country, city.
 * (Avatar/photo lives in the right-side "My Profile" card, matching the
 * reference dashboard's layout, not inline here.)
 */
export default function TouristProfileForm({ profile, errors, isEditing, onFieldChange }) {
  return (
    <section className="tp-card">
      <h3 className="tp-card__title">Personal Information</h3>

      <div className="tp-grid">
        <div className="tp-field">
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => onFieldChange("fullName", e.target.value)}
              placeholder="Enter your full name"
            />
          ) : (
            <p>{profile.fullName}</p>
          )}
          {errors.fullName && <span className="tp-error">{errors.fullName}</span>}
        </div>

        <div className="tp-field">
          <label>Email</label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="you@example.com"
            />
          ) : (
            <p>{profile.email}</p>
          )}
          {errors.email && <span className="tp-error">{errors.email}</span>}
        </div>

        <div className="tp-field">
          <label>Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="+1 210 555 7890"
            />
          ) : (
            <p>{profile.phone}</p>
          )}
          {errors.phone && <span className="tp-error">{errors.phone}</span>}
        </div>

        <div className="tp-field">
          <label>Country</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.country}
              onChange={(e) => onFieldChange("country", e.target.value)}
              placeholder="Country"
            />
          ) : (
            <p>{profile.country}</p>
          )}
          {errors.country && <span className="tp-error">{errors.country}</span>}
        </div>

        <div className="tp-field">
          <label>City</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.city}
              onChange={(e) => onFieldChange("city", e.target.value)}
              placeholder="City"
            />
          ) : (
            <p>{profile.city}</p>
          )}
          {errors.city && <span className="tp-error">{errors.city}</span>}
        </div>
      </div>
    </section>
  );
}
