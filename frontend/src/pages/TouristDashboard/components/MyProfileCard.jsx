import { useRef } from "react";

/**
 * Right-column summary card — mirrors the reference dashboard's
 * "My Profile" widget: avatar photo, name, and email/phone/location
 * rows with icons. Lives outside the main form so it always shows the
 * committed (saved) info, except while actively editing, when it
 * previews the draft avatar so the photo upload feels live.
 */
export default function MyProfileCard({
  profile,
  isEditing,
  onEdit,
  onAvatarChange,
}) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onAvatarChange(previewUrl);
  };

  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="tp-mycard">
      <div className="tp-mycard-header">
        <h3>My Profile</h3>
        {!isEditing && (
          <button type="button" className="tp-mycard-edit" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>

      <div className="tp-mycard-identity">
        <div
          className={`tp-mycard-avatar ${isEditing ? "tp-mycard-avatar--editable" : ""}`}
          onClick={handleAvatarClick}
          role={isEditing ? "button" : undefined}
          tabIndex={isEditing ? 0 : undefined}
          title={isEditing ? "Change profile photo" : undefined}
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.fullName} />
          ) : (
            <span>{initials}</span>
          )}
          {isEditing && <div className="tp-mycard-avatar-badge">Change</div>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="tp-hidden-input"
          onChange={handleFileSelected}
        />
        <p className="tp-mycard-name">{profile.fullName}</p>
        <p className="tp-mycard-role">Tourist</p>
      </div>

      <div className="tp-mycard-rows">
        <div className="tp-mycard-row">
          <MailIcon />
          <span>{profile.email}</span>
        </div>
        <div className="tp-mycard-row">
          <PhoneIcon />
          <span>{profile.phone}</span>
        </div>
        <div className="tp-mycard-row">
          <PinIcon />
          <span>
            {profile.city}, {profile.country}
          </span>
        </div>
      </div>
    </aside>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
