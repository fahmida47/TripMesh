import { useState } from "react";

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Account Settings section: password change (mock only, no real auth)
 * and email notification toggle.
 *
 * Password change is intentionally independent from the profile
 * edit/save/cancel flow — it has its own local state and its own
 * "Change Password" action, per the issue's acceptance criteria.
 */
export default function AccountSettings({
  emailNotifications,
  isEditing,
  onToggleNotifications,
}) {
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleFieldChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage("");
  };

  const validatePasswordForm = () => {
    const nextErrors = {};

    if (!passwordForm.currentPassword) {
      nextErrors.currentPassword = "Current password is required.";
    }
    if (!passwordForm.newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (passwordForm.newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters.";
    }
    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChangePassword = () => {
    if (!validatePasswordForm()) {
      setSuccessMessage("");
      return;
    }

    // Frontend-only mock — no real backend/auth call.
    setSuccessMessage("Password updated (mock only — no real account was changed).");
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordErrors({});
  };

  return (
    <section className="tp-card">
      <h3 className="tp-card__title">Account Settings</h3>

      <div className="tp-grid">
        <div className="tp-field">
          <label>Current Password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => handleFieldChange("currentPassword", e.target.value)}
            placeholder="••••••••"
          />
          {passwordErrors.currentPassword && (
            <span className="tp-error">{passwordErrors.currentPassword}</span>
          )}
        </div>

        <div className="tp-field">
          <label>New Password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => handleFieldChange("newPassword", e.target.value)}
            placeholder="••••••••"
          />
          {passwordErrors.newPassword && (
            <span className="tp-error">{passwordErrors.newPassword}</span>
          )}
        </div>

        <div className="tp-field">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
          />
          {passwordErrors.confirmPassword && (
            <span className="tp-error">{passwordErrors.confirmPassword}</span>
          )}
        </div>
      </div>

      <button type="button" className="tp-btn tp-btn--secondary" onClick={handleChangePassword}>
        Change Password
      </button>
      {successMessage && <p className="tp-success">{successMessage}</p>}

      <div className="tp-toggle-row">
        <div>
          <label className="tp-toggle-label">Email Notifications</label>
          <p className="tp-muted">Receive booking and offer updates by email.</p>
        </div>
        <label className={`tp-switch ${!isEditing ? "tp-switch--disabled" : ""}`}>
          <input
            type="checkbox"
            checked={emailNotifications}
            disabled={!isEditing}
            onChange={(e) => onToggleNotifications(e.target.checked)}
          />
          <span className="tp-switch__track">
            <span className="tp-switch__thumb" />
          </span>
        </label>
      </div>
    </section>
  );
}
