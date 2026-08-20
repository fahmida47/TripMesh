import { useMemo, useRef, useState } from "react";
import { Check, Image as ImageIcon, UserRound, UserCog } from "lucide-react";
import { touristProfile } from "../mockProfile";
import "./TouristProfile.css";

const INITIAL_FORM = {
  fullName: touristProfile.fullName || "",
  phone: touristProfile.phone || "",
  email: touristProfile.email || "",
  bio: "",
  addressLine1: "",
  addressLine2: "",
  city: touristProfile.city || "",
  state: "",
  zip: "",
  country: touristProfile.country || "",
};

const COUNTRIES = [
  "Bangladesh",
  "India",
  "Nepal",
  "Bhutan",
  "Pakistan",
  "Sri Lanka",
  "United States",
  "United Kingdom",
];

export default function TouristProfile() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [photo, setPhoto] = useState(touristProfile.avatar || "");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [savedSection, setSavedSection] = useState("");
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const initials = useMemo(() => {
    return form.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "AF";
  }, [form.fullName]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSavedSection("");
  };

  const handleBioChange = (event) => {
    setForm((current) => ({
      ...current,
      bio: event.target.value.slice(0, 300),
    }));
    setSavedSection("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setSavedSection("");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPhoto(reader.result);
      setSavedSection("");
    };
    reader.readAsDataURL(file);
  };

  const saveSection = (section) => {
    setSavedSection(section);
    window.setTimeout(() => setSavedSection(""), 1800);
  };

  const saveButtonContent = (section) =>
    savedSection === section ? (
      <>
        <Check size={15} /> Saved
      </>
    ) : (
      "Save Changes"
    );

  return (
    <div className="tourist-profile-page">
      <div className="tourist-profile-heading">
        <div className="tourist-profile-title-row">
          <span className="tourist-profile-title-icon" aria-hidden="true"><UserCog size={26} /></span>
          <h1>My Profile</h1>
        </div>
        <p>Manage your personal information and travel preferences</p>
      </div>

      <section className="tourist-profile-main-card">
        <div
          className="tourist-profile-cover"
          style={coverPhoto ? { backgroundImage: `url(${coverPhoto})` } : {}}
        >
          {!coverPhoto && (
            <div className="tourist-profile-cover-placeholder">
              <ImageIcon size={24} />
              <span>Cover Photo</span>
            </div>
          )}

          <button
            type="button"
            className="tourist-profile-edit-cover-button"
            onClick={() => coverInputRef.current?.click()}
          >
            Edit Cover Photo
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleCoverChange}
            hidden
          />
        </div>

        <div className="tourist-profile-header-info">
          <div className="tourist-profile-photo-column tourist-profile-header-photo">
            <div
              className="tourist-profile-photo-wrap"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {photo ? (
                <img src={photo} alt="Profile" className="tourist-profile-photo" />
              ) : (
                <div className="tourist-profile-photo tourist-profile-photo-placeholder">
                  {initials || <UserRound size={38} />}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoChange}
              hidden
            />
            <span className="tourist-profile-photo-label">Profile Picture</span>
          </div>

          <div className="tourist-profile-fields tourist-profile-header-fields">
            <label>
              <span>Full Name</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                placeholder="Enter your full name"
              />
            </label>

            <label>
              <span>Phone Number</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                placeholder="Enter phone number"
              />
            </label>

            <label className="tourist-profile-email-field">
              <span>Email Address</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="Enter email address"
              />
            </label>
          </div>
        </div>

        <div className="tourist-profile-card-footer tourist-profile-main-footer">
          <button
            type="button"
            className="tourist-profile-save-button"
            onClick={() => saveSection("basic")}
          >
            {saveButtonContent("basic")}
          </button>
        </div>
      </section>
      <section className="tourist-profile-card">
        <div className="tourist-profile-card-heading">
          <h2>About Me</h2>
          <p>Tell us a little bit about yourself</p>
        </div>

        <div className="tourist-profile-fields">
          <label>
            <span>Bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleBioChange}
              maxLength={300}
              placeholder="Write something about yourself..."
            />
          </label>
          <div className="tourist-profile-character-count">{form.bio.length} / 300</div>
        </div>

        <div className="tourist-profile-card-footer">
          <button
            type="button"
            className="tourist-profile-save-button"
            onClick={() => saveSection("bio")}
          >
            {saveButtonContent("bio")}
          </button>
        </div>
      </section>

      <section className="tourist-profile-card">
        <div className="tourist-profile-card-heading">
          <h2>Address Information</h2>
          <p>Add your address details</p>
        </div>

        <div className="tourist-profile-address-grid tourist-profile-fields">
          <label className="tourist-profile-span-2">
            <span>Address Line 1</span>
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={updateField}
              placeholder="Enter your address"
            />
          </label>

          <label className="tourist-profile-span-2">
            <span>Address Line 2 <em>(Optional)</em></span>
            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={updateField}
              placeholder="Apartment, suite, unit, building, etc."
            />
          </label>

          <label>
            <span>City</span>
            <input
              name="city"
              value={form.city}
              onChange={updateField}
              placeholder="Enter city"
            />
          </label>

          <label>
            <span>State / Province</span>
            <input
              name="state"
              value={form.state}
              onChange={updateField}
              placeholder="Enter state or province"
            />
          </label>

          <label>
            <span>Zip / Postal Code</span>
            <input
              name="zip"
              value={form.zip}
              onChange={updateField}
              placeholder="Enter zip code"
            />
          </label>

          <label className="tourist-profile-span-3">
            <span>Country</span>
            <select name="country" value={form.country} onChange={updateField}>
              <option value="">Select your country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tourist-profile-card-footer">
          <button
            type="button"
            className="tourist-profile-save-button"
            onClick={() => saveSection("address")}
          >
            {saveButtonContent("address")}
          </button>
        </div>
      </section>
    </div>
  );
}
