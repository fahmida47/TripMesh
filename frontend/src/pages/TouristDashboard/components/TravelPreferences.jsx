import {
  DESTINATION_OPTIONS,
  DESTINATION_IMAGES,
  TOUR_TYPE_OPTIONS,
  BUDGET_OPTIONS,
} from "../mockProfile";

/**
 * Travel Preferences section: preferred destinations (multi-select),
 * preferred tour type (Single / Dual / Group), preferred budget range.
 *
 * Destination rows are styled like the reference dashboard's "Upcoming
 * Trips" cards — photo on the left, details on the right — instead of a
 * generic chip grid. Photos come from DESTINATION_IMAGES in
 * mockProfile.js; drop real image imports in there and these rows pick
 * them up automatically. Until then, each row shows a neutral
 * placeholder so nothing looks broken.
 */
export default function TravelPreferences({
  profile,
  errors,
  isEditing,
  onToggleDestination,
  onFieldChange,
}) {
  return (
    <section className="tp-card">
      <h3 className="tp-card__title">Travel Preferences</h3>

      <div className="tp-field">
        <label>Preferred Destinations</label>
        <div className="tp-dest-list">
          {DESTINATION_OPTIONS.map((dest) => {
            const active = profile.preferredDestinations.includes(dest);
            const image = DESTINATION_IMAGES[dest];
            return (
              <button
                type="button"
                key={dest}
                className={`tp-dest-row ${active ? "tp-dest-row--active" : ""}`}
                disabled={!isEditing}
                onClick={() => onToggleDestination(dest)}
              >
                <span className="tp-dest-row-thumb">
                  {image ? <img src={image} alt={dest} /> : <PlaceholderThumb />}
                </span>

                <span className="tp-dest-row-info">
                  <span className="tp-dest-row-name">{dest}</span>
                  <span className="tp-dest-row-sub">
                    <PinIcon />
                    Bangladesh
                  </span>
                </span>

                <span
                  className={`tp-dest-row-status ${
                    active ? "tp-dest-row-status--active" : ""
                  }`}
                >
                  {active ? "Selected" : isEditing ? "Add" : ""}
                </span>
              </button>
            );
          })}
        </div>
        {!isEditing && profile.preferredDestinations.length === 0 && (
          <p className="tp-muted">No destinations selected yet.</p>
        )}
        {errors.preferredDestinations && (
          <span className="tp-error">{errors.preferredDestinations}</span>
        )}
      </div>

      <div className="tp-grid">
        <div className="tp-field">
          <label>Preferred Tour Type</label>
          {isEditing ? (
            <div className="tp-radio-row">
              {TOUR_TYPE_OPTIONS.map((type) => (
                <label className="tp-radio" key={type}>
                  <input
                    type="radio"
                    name="preferredTourType"
                    checked={profile.preferredTourType === type}
                    onChange={() => onFieldChange("preferredTourType", type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          ) : (
            <p>{profile.preferredTourType}</p>
          )}
        </div>

        <div className="tp-field">
          <label>Preferred Budget Range</label>
          {isEditing ? (
            <select
              value={profile.preferredBudget}
              onChange={(e) => onFieldChange("preferredBudget", e.target.value)}
            >
              {BUDGET_OPTIONS.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          ) : (
            <p>{profile.preferredBudget}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PlaceholderThumb() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
