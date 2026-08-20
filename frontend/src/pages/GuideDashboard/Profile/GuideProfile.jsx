import { useState } from "react";

import "./GuideProfile.css";

import GuideSidebar from "../components/GuideSidebar";
import GuideHeader from "../components/GuideHeader";

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

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      image: null,
      title: "",
      description: "",
    },
    {
      id: 2,
      image: null,
      title: "",
      description: "",
    },
    {
      id: 3,
      image: null,
      title: "",
      description: "",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setProfileImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setCoverImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              [field]: value,
            }
          : experience
      )
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
          : experience
      )
    );
  };

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: null,
        title: "",
        description: "",
      },
    ]);
  };

  const handleSave = () => {
    const completeProfileData = {
      ...profile,
      profileImage: profileImage?.file || null,
      coverImage: coverImage?.file || null,
      experiences,
    };

    console.log("Complete Guide Profile:", completeProfileData);

    alert("Profile saved successfully!");
  };

  const goToTourServices = () => {
    window.location.href = "/guide-dashboard/tour-services";
  };

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

          {/* PROFILE HEADER */}
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
                  accept="image/*"
                  onChange={handleCoverImage}
                  hidden
                />
              </label>
            </div>

            <div className="profile-header-info">
              <div className="profile-photo-wrapper">
                <label className="profile-photo">
                  {profileImage ? (
                    <img
                      src={profileImage.preview}
                      alt="Profile preview"
                    />
                  ) : (
                    <span>👤</span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
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
            {/* BIO */}
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

              <span className="character-count">
                {profile.bio.length}/1000
              </span>
            </section>

            {/* CONTACT INFORMATION */}
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

            {/* TOUR SERVICES */}
            <section className="profile-section-card">
              <h2>Tour Services</h2>

              <p>
                Manage and showcase the tour services your company offers.
              </p>

              <div className="empty-tour-services">
                <div className="tour-service-icon">🗺️</div>

                <h3>You haven't added any tour services yet.</h3>

                <p>Add your tour services to start getting bookings.</p>

                <div className="tour-service-buttons">
                  <button
                    type="button"
                    onClick={goToTourServices}
                  >
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

            {/* COMPLETED TOUR EXPERIENCE */}
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
                  <div
                    className="experience-item"
                    key={experience.id}
                  >
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
                          <small>JPG, PNG</small>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          handleExperienceImage(
                            experience.id,
                            e.target.files?.[0]
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
                          e.target.value
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
                          e.target.value
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

          {/* ONE SAVE BUTTON FOR FULL PROFILE */}
          <div className="profile-final-save">
            <button
              type="button"
              className="profile-save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideProfile;