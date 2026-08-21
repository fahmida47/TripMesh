import { useMemo, useRef, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  UserRound,
  UserCog,
} from "lucide-react";

import { touristProfile } from "../mockProfile";
import TouristSidebar from "../components/TouristSidebar";

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
  "Canada",
  "Australia",
];

const TouristProfile = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [saved, setSaved] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const profileInitials = useMemo(() => {
    if (!formData.fullName.trim()) {
      return "TP";
    }

    return formData.fullName
      .trim()
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [formData.fullName]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage({
      file,
      preview: URL.createObjectURL(file),
    });

    setSaved(false);
  };

  const handleCoverImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverImage({
      file,
      preview: URL.createObjectURL(file),
    });

    setSaved(false);
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      profileImage: profileImage?.file || null,
      coverImage: coverImage?.file || null,
    };

    console.log("Tourist Profile Data:", profileData);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="tourist-profile-layout">
      {/* FIXED TOURIST SIDEBAR */}
      <TouristSidebar />

      {/* MAIN PROFILE CONTENT */}
      <main className="tourist-profile-page">
        {/* PAGE HEADING */}
        <div className="tourist-profile-page-heading">
          <div className="tourist-profile-title-icon">
            <UserCog size={22} />
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        {/* =========================
            BASIC INFORMATION
        ========================= */}
        <section className="tourist-profile-main-card">
          {/* COVER PHOTO */}
          <div
            className="tourist-profile-cover"
            style={
              coverImage
                ? {
                    backgroundImage: `url(${coverImage.preview})`,
                  }
                : {}
            }
          >
            {!coverImage && (
              <div className="tourist-cover-placeholder">
                <ImageIcon size={25} />

                <span>Cover Photo</span>
              </div>
            )}

            <button
              type="button"
              className="tourist-edit-cover-btn"
              onClick={() => coverInputRef.current?.click()}
            >
              Edit Cover Photo
            </button>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImage}
              hidden
            />
          </div>

          <div className="tourist-profile-basic-info">
            {/* PROFILE PICTURE */}
            <div className="tourist-profile-photo-section">
              <button
                type="button"
                className="tourist-profile-photo"
                onClick={() =>
                  profileInputRef.current?.click()
                }
              >
                {profileImage ? (
                  <img
                    src={profileImage.preview}
                    alt="Tourist profile"
                  />
                ) : (
                  <span>{profileInitials}</span>
                )}
              </button>

              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImage}
                hidden
              />

              <p>Profile Picture</p>
            </div>

            {/* FULL NAME */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-full-name">
                Full Name
              </label>

              <input
                id="tourist-full-name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* PHONE */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-phone">
                Phone Number
              </label>

              <input
                id="tourist-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* EMAIL */}
            <div className="tourist-profile-field tourist-email-field">
              <label htmlFor="tourist-email">
                Email Address
              </label>

              <input
                id="tourist-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
          </div>
        </section>

        {/* =========================
            ABOUT ME
        ========================= */}
        <section className="tourist-profile-card">
          <div className="tourist-profile-section-heading">
            <h2>About Me</h2>

            <p>Tell us a little bit about yourself</p>
          </div>

          <div className="tourist-profile-field">
            <label htmlFor="tourist-bio">
              Bio
            </label>

            <div className="tourist-bio-wrapper">
              <textarea
                id="tourist-bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={300}
                placeholder="Write something about yourself..."
              />

              <span className="tourist-character-count">
                {formData.bio.length} / 300
              </span>
            </div>
          </div>
        </section>

        {/* =========================
            ADDRESS INFORMATION
        ========================= */}
        <section className="tourist-profile-card">
          <div className="tourist-profile-section-heading">
            <h2>Address Information</h2>

            <p>
              Add or update your current address information
            </p>
          </div>

          <div className="tourist-address-grid">
            {/* ADDRESS LINE 1 */}
            <div className="tourist-profile-field tourist-address-full">
              <label htmlFor="address-line-1">
                Address Line 1
              </label>

              <input
                id="address-line-1"
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>

            {/* ADDRESS LINE 2 */}
            <div className="tourist-profile-field tourist-address-full">
              <label htmlFor="address-line-2">
                Address Line 2 (Optional)
              </label>

              <input
                id="address-line-2"
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc."
              />
            </div>

            {/* CITY */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-city">
                City
              </label>

              <input
                id="tourist-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            {/* STATE */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-state">
                State / Province
              </label>

              <input
                id="tourist-state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state or province"
              />
            </div>

            {/* ZIP */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-zip">
                Zip / Postal Code
              </label>

              <input
                id="tourist-zip"
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
            </div>

            {/* COUNTRY */}
            <div className="tourist-profile-field">
              <label htmlFor="tourist-country">
                Country
              </label>

              <select
                id="tourist-country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">
                  Select country
                </option>

                {COUNTRIES.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* =========================
            SAVE PROFILE
        ========================= */}
        <div className="tourist-profile-save-area">
          {saved && (
            <div className="tourist-profile-saved-message">
              <Check size={17} />
              Profile saved
            </div>
          )}

          <button
            type="button"
            className="tourist-profile-save-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}

export default TouristProfile;