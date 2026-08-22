import { useEffect, useState } from "react";

import "./GuideProfile.css";
import GuideSidebar from "../components/GuideSidebar";
import GuideHeader from "../components/GuideHeader";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

function GuideProfile() {
  const [profile, setProfile] = useState({
    companyName: "",
    ownerName: "",
    bio: "",
    phone: "",
    email: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/guide/profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load guide profile.");
      }

      const savedProfile = data.profile;

      if (!savedProfile) {
        setLoading(false);
        return;
      }

      setProfile({
        companyName: savedProfile.company_name || "",
        ownerName: savedProfile.contact_person || "",
        bio: savedProfile.bio || "",
        phone: savedProfile.phone || "",
        email: savedProfile.email || "",
        address: savedProfile.address || "",
      });

      if (savedProfile.profile_picture) {
        setProfileImage({
          preview: `${STORAGE_URL}/${savedProfile.profile_picture}`,
        });
      }

      if (savedProfile.cover_photo) {
        setCoverImage({
          preview: `${STORAGE_URL}/${savedProfile.cover_photo}`,
        });
      }

      if (Array.isArray(savedProfile.experiences)) {
        setExperiences(
          savedProfile.experiences.map((experience) => ({
            id: experience.id,
            title: experience.title || "",
            description: experience.description || "",
            image: experience.photo
              ? {
                  preview: `${STORAGE_URL}/${experience.photo}`,
                }
              : null,
          })),
        );
      }
    } catch (error) {
      console.error("Load profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              [field]: value,
            }
          : experience,
      ),
    );
  };

  const handleExperienceImage = (id, file) => {
    if (!file) return;

    setExperiences((prev) =>
      prev.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              image: {
                file,
                preview: URL.createObjectURL(file),
              },
            }
          : experience,
      ),
    );
  };

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        image: null,
        title: "",
        description: "",
      },
    ]);
  };

  const saveNewExperience = async (experience) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSuccessMessage("You are not logged in.");
        return false;
      }

      const formData = new FormData();

      formData.append("title", experience.title.trim());
      formData.append("description", experience.description.trim());

      // Photo is optional.
      // Only append it when the user actually selected a file.
      if (experience.image?.file) {
        formData.append("photo", experience.image.file);
      }

      const response = await fetch(
        `${API_BASE_URL}/guide/profile/experiences`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Experience save error:", data);

        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : "";

        setSuccessMessage(
          data.message || validationErrors || "Failed to save experience.",
        );

        return false;
      }

      console.log("Experience added:", data.experience);
      return true;
    } catch (error) {
      console.error("Experience save error:", error);

      setSuccessMessage("Something went wrong while saving the experience.");

      return false;
    }
  };

  const uploadProfilePicture = async (token) => {
    if (!profileImage?.file) return true;

    const formData = new FormData();
    formData.append("profile_picture", profileImage.file);

    const response = await fetch(
      `${API_BASE_URL}/guide/profile/profile-picture`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Profile picture upload error:", data);
      throw new Error(data.message || "Profile picture upload failed.");
    }

    return true;
  };

  const uploadCoverPhoto = async (token) => {
    if (!coverImage?.file) return true;

    const formData = new FormData();
    formData.append("cover_photo", coverImage.file);

    const response = await fetch(`${API_BASE_URL}/guide/profile/cover-photo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cover photo upload error:", data);
      throw new Error(data.message || "Cover photo upload failed.");
    }

    return true;
  };

  const handleSave = async () => {
    setSuccessMessage("");

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setSuccessMessage("You are not logged in.");
        return;
      }

      // Save basic profile first.
      const response = await fetch(`${API_BASE_URL}/guide/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: profile.companyName,
          contact_person: profile.ownerName,
          bio: profile.bio,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Save error:", data);

        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : "";

        setSuccessMessage(
          data.message || validationErrors || "Failed to save profile.",
        );

        return;
      }

      console.log("Profile saved:", data.profile);

      // Upload selected profile picture.
      await uploadProfilePicture(token);

      // Upload selected cover photo.
      await uploadCoverPhoto(token);

      // Save newly added experiences.
      for (const experience of experiences) {
        if (String(experience.id).startsWith("new-")) {
          if (!experience.title.trim()) {
            setSuccessMessage("Please enter an experience title.");
            return;
          }

          if (!experience.description.trim()) {
            setSuccessMessage("Please enter your experience description.");
            return;
          }

          const saved = await saveNewExperience(experience);

          if (!saved) {
            return;
          }
        }
      }

      await loadProfile();

      setSuccessMessage("Profile saved successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Save profile error:", error);

      setSuccessMessage(
        error.message || "Something went wrong while saving the profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const goToTourServices = () => {
    window.location.href = "/guide-dashboard/tour-services";
  };

  if (loading) {
    return (
      <div className="guide-dashboard">
        <GuideSidebar />

        <div className="dashboard-content">
          <GuideHeader />

          <div className="guide-profile-page">
            <div className="guide-profile-heading">
              <h1>My Profile</h1>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-dashboard">
      <GuideSidebar />

      <div className="dashboard-content">
        <GuideHeader />

        <div className="guide-profile-page">
          <div className="guide-profile-heading">
            <h1>My Profile</h1>
            <p>Manage your company information and preferences</p>
          </div>

          <section className="profile-main-card">
            <div
              className="profile-cover"
              style={
                coverImage
                  ? {
                      backgroundImage: `url(${coverImage.preview})`,
                    }
                  : {}
              }
            >
              {!coverImage && (
                <div className="cover-placeholder">
                  <span>▧</span>
                  <p>Cover Photo</p>
                </div>
              )}

              <label className="edit-cover-btn">
                Edit Cover Photo
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleCoverImage}
                  hidden
                />
              </label>
            </div>

            <div className="profile-header-info">
              <div className="profile-photo-wrapper">
                <label className="profile-photo">
                  {profileImage ? (
                    <img src={profileImage.preview} alt="Profile preview" />
                  ) : (
                    <span>👤</span>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleProfileImage}
                    hidden
                  />
                </label>

                <p>Profile Picture</p>
              </div>

              <div className="profile-field">
                <label>Guide Company Name</label>

                <input
                  type="text"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  placeholder="Enter guide company name"
                />
              </div>

              <div className="profile-field">
                <label>Contact Person / Owner</label>

                <input
                  type="text"
                  name="ownerName"
                  value={profile.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner or contact person name"
                />
              </div>
            </div>
          </section>

          <div className="profile-content-grid">
            <section className="profile-section-card">
              <h2>Bio</h2>

              <p>
                Tell clients about your company and what makes your tours
                unique.
              </p>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                maxLength={1000}
                placeholder="Write about your company, experience, specialties, and what clients can expect..."
              />

              <span className="character-count">{profile.bio.length}/1000</span>
            </section>

            <section className="profile-section-card">
              <h2>Contact Information</h2>

              <p>
                Update your contact details so clients can reach you easily.
              </p>

              <div className="contact-grid">
                <div className="profile-field">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="profile-field">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
            </section>

            <section className="profile-section-card">
              <h2>Tour Services</h2>

              <p>Manage and showcase the tour services your company offers.</p>

              <div className="empty-tour-services">
                <div className="tour-service-icon">🗺️</div>

                <h3>You haven't added any tour services yet.</h3>

                <p>Add your tour services to start getting bookings.</p>

                <div className="tour-service-buttons">
                  <button type="button" onClick={goToTourServices}>
                    Go to Tour Services →
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={goToTourServices}
                  >
                    + Add Tour Service
                  </button>
                </div>
              </div>
            </section>

            <section className="profile-section-card">
              <div className="experience-header">
                <div>
                  <h2>Completed Tour Experience</h2>

                  <p>
                    Share your completed tours and experiences with potential
                    clients.
                  </p>
                </div>

                <button
                  type="button"
                  className="add-experience-btn"
                  onClick={handleAddExperience}
                >
                  + Add Experience
                </button>
              </div>

              <div className="experience-grid">
                {experiences.map((experience) => (
                  <div className="experience-item" key={experience.id}>
                    <label className="experience-upload">
                      {experience.image ? (
                        <img
                          src={experience.image.preview}
                          alt="Experience preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "7px",
                          }}
                        />
                      ) : (
                        <>
                          <span>▧</span>
                          <p>Upload Photo</p>
                          <small>JPG, PNG, WEBP</small>
                        </>
                      )}

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        hidden
                        onChange={(e) =>
                          handleExperienceImage(
                            experience.id,
                            e.target.files?.[0],
                          )
                        }
                      />
                    </label>

                    <label>Experience Title</label>

                    <input
                      type="text"
                      value={experience.title}
                      onChange={(e) =>
                        handleExperienceChange(
                          experience.id,
                          "title",
                          e.target.value,
                        )
                      }
                      placeholder="Enter a short title"
                    />

                    <label>Your Experience</label>

                    <textarea
                      value={experience.description}
                      maxLength={300}
                      onChange={(e) =>
                        handleExperienceChange(
                          experience.id,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Write about this experience..."
                    />

                    <span className="experience-count">
                      {experience.description.length} / 300
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="profile-final-save">
            {successMessage && (
              <div className="profile-success-message">{successMessage}</div>
            )}

            <button
              type="button"
              className="profile-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideProfile;
