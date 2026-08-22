import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AddTourService.css";

import GuideSidebar from "../components/GuideSidebar";
import GuideHeader from "../components/GuideHeader";

function AddTourService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    tourType: "",
    duration: "",
    price: "",
    description: "",
  });

  const [tourImage, setTourImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setTourImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleCancel = () => {
    navigate("/guide-dashboard/tour-services");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tourServiceData = {
      ...formData,
      image: tourImage?.file || null,
    };

    console.log("Tour Service:", tourServiceData);

    alert("Tour service form completed!");

    navigate("/guide-dashboard/tour-services");
  };

  return (
    <div className="guide-dashboard">
      <GuideSidebar />

      <div className="dashboard-content">
        <GuideHeader />

        <main className="add-tour-service-page">
          <div className="add-tour-service-heading">
            <div>
              <h1>Add Tour Service</h1>
              <p>Create a new tour package for your guide company.</p>
            </div>

            <button
              type="button"
              className="back-tour-services-btn"
              onClick={handleCancel}
            >
              ← Back to Tour Services
            </button>
          </div>

          <form className="add-tour-service-form" onSubmit={handleSubmit}>
            {/* TOUR IMAGE */}
            <section className="tour-form-card">
              <h2>Tour Image</h2>
              <p>Add a cover image for this tour package.</p>

              <label className="tour-image-upload">
                {tourImage ? (
                  <img src={tourImage.preview} alt="Tour preview" />
                ) : (
                  <div className="tour-image-placeholder">
                    <span>▧</span>
                    <strong>Upload Tour Photo</strong>
                    <small>JPG or PNG</small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </section>

            {/* BASIC INFORMATION */}
            <section className="tour-form-card">
              <h2>Package Information</h2>
              <p>Enter the basic information for your tour service.</p>

              <div className="tour-form-grid">
                <div className="tour-form-field full-width">
                  <label>Tour / Package Name</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter tour package name"
                    required
                  />
                </div>

                <div className="tour-form-field">
                  <label>Destination</label>

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    required
                  />
                </div>

                <div className="tour-form-field">
                  <label>Tour Type</label>

                  <select
                    name="tourType"
                    value={formData.tourType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select tour type</option>
                    <option value="Single Tour">Single Tour</option>
                    <option value="Dual Tour">Dual Tour</option>
                    <option value="Group Tour">Group Tour</option>
                  </select>
                </div>

                <div className="tour-form-field">
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Example: 1 Day"
                    required
                  />
                </div>

                <div className="tour-form-field">
                  <label>Price (BDT)</label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                    required
                  />
                </div>

                <div className="tour-form-field full-width">
                  <label>Package Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    placeholder="Describe what is included in this tour package..."
                    required
                  />

                  <span className="tour-description-count">
                    {formData.description.length}/1000
                  </span>
                </div>
              </div>
            </section>

            <div className="tour-form-actions">
              <button
                type="button"
                className="cancel-tour-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button type="submit" className="save-tour-btn">
                Add Tour Service
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddTourService;
