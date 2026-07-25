import { useState } from "react";
import TouristProfileForm from "./TouristProfileForm";
import TravelPreferences from "./TravelPreferences";
import EmergencyContactForm from "./EmergencyContactForm";
import AccountSettings from "./AccountSettings";
import MyProfileCard from "./MyProfileCard";
import { touristProfile } from "../mockProfile";
import "./TouristProfile.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+()\d\s-]{7,20}$/;

export default function TouristProfile() {
  // savedProfile = source of truth (committed data).
  // draftProfile = working copy while editing.
  const [savedProfile, setSavedProfile] = useState(touristProfile);
  const [draftProfile, setDraftProfile] = useState(touristProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setDraftProfile(savedProfile);
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile(savedProfile); // restore previous values
    setErrors({});
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setDraftProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (url) => {
    setDraftProfile((prev) => ({ ...prev, avatar: url }));
  };

  const handleToggleDestination = (dest) => {
    setDraftProfile((prev) => {
      const has = prev.preferredDestinations.includes(dest);
      const next = has
        ? prev.preferredDestinations.filter((d) => d !== dest)
        : [...prev.preferredDestinations, dest];
      return { ...prev, preferredDestinations: next };
    });
  };

  const handleEmergencyFieldChange = (field, value) => {
    setDraftProfile((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleToggleNotifications = (checked) => {
    setDraftProfile((prev) => ({ ...prev, emailNotifications: checked }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!draftProfile.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!draftProfile.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(draftProfile.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!draftProfile.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!PHONE_REGEX.test(draftProfile.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!draftProfile.country.trim()) {
      nextErrors.country = "Country is required.";
    }
    if (!draftProfile.city.trim()) {
      nextErrors.city = "City is required.";
    }
    if (draftProfile.preferredDestinations.length === 0) {
      nextErrors.preferredDestinations = "Select at least one destination.";
    }
    if (!draftProfile.emergencyContact.name.trim()) {
      nextErrors.emergencyName = "Emergency contact name is required.";
    }
    if (
      draftProfile.emergencyContact.phone &&
      !PHONE_REGEX.test(draftProfile.emergencyContact.phone)
    ) {
      nextErrors.emergencyPhone = "Enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setSavedProfile(draftProfile); // commit to frontend state
    setIsEditing(false);
  };

  // Split top-level vs. emergency-contact errors for the child component.
  const emergencyErrors = {
    name: errors.emergencyName,
    phone: errors.emergencyPhone,
  };

  return (
    <div className="tp-page">
      <div className="tp-header">
        <div>
          <h2>Profile Settings</h2>
          <p className="tp-muted">
            View and manage your personal information, travel preferences, and account settings.
          </p>
        </div>

        {!isEditing && (
          <button type="button" className="tp-btn tp-btn--primary" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="tp-layout">
        <div className="tp-sections">
          <TouristProfileForm
            profile={draftProfile}
            errors={errors}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />

          <TravelPreferences
            profile={draftProfile}
            errors={errors}
            isEditing={isEditing}
            onToggleDestination={handleToggleDestination}
            onFieldChange={handleFieldChange}
          />

          <EmergencyContactForm
            contact={draftProfile.emergencyContact}
            errors={emergencyErrors}
            isEditing={isEditing}
            onFieldChange={handleEmergencyFieldChange}
          />

          <AccountSettings
            emailNotifications={draftProfile.emailNotifications}
            isEditing={isEditing}
            onToggleNotifications={handleToggleNotifications}
          />
        </div>

        <MyProfileCard
          profile={draftProfile}
          isEditing={isEditing}
          onEdit={handleEdit}
          onAvatarChange={handleAvatarChange}
        />
      </div>

      {isEditing && (
        <div className="tp-footer-actions">
          <button type="button" className="tp-btn tp-btn--ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="tp-btn tp-btn--primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
