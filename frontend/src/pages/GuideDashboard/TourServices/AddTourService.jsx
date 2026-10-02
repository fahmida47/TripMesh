import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config.js";
import { getToken } from "../../../utils/auth.js";

import "./AddTourService.css";

function AddTourService() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    tourType: "",
    duration: "",
    price: "",
    description: "",
    max_travelers: "",
  });

  const [tourImage, setTourImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/guide/tour-services`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load service.");
      const service = data.services.find((item) => String(item.id) === id);
      if (!service) throw new Error("Tour service not found.");
      setFormData({ title: service.title, destination: service.location, tourType: service.tour_type,
        duration: service.duration, price: String(service.price), description: service.description,
        max_travelers: String(service.max_travelers) });
    }).catch((err) => setError(err.message));
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("location", formData.destination);
    payload.append("tour_type", formData.tourType);
    payload.append("price", formData.price);
    payload.append("duration", formData.duration);
    payload.append("max_travelers", formData.max_travelers);
    if (tourImage?.file) payload.append("image", tourImage.file);
    if (id) payload.append("_method", "PUT");
    try {
      const response = await fetch(`${API_BASE_URL}/guide/tour-services${id ? `/${id}` : ""}`, {
        method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` }, body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || Object.values(data.errors || {}).flat().join(" ") || "Could not save tour service.");
      navigate("/guide-dashboard/tour-services");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <main className="add-tour-service-page">
      <div className="add-tour-service-heading">
        <div>
          <h1>{id ? "Edit Tour Service" : "Add Tour Service"}</h1>

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
        {error && <p role="alert">{error}</p>}
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
            {/* TOUR NAME */}
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

            {/* DESTINATION */}
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

            {/* TOUR TYPE */}
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

            {/* DURATION */}
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

            {/* PRICE */}
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

            {/* DESCRIPTION */}
            <div className="tour-form-field">
              <label>Maximum Travelers</label>
              <input type="number" name="max_travelers" value={formData.max_travelers} onChange={handleChange} min="1" required />
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

        {/* ACTIONS */}
        <div className="tour-form-actions">
          <button
            type="button"
            className="cancel-tour-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button type="submit" className="save-tour-btn" disabled={saving}>
            {saving ? "Saving..." : id ? "Save Changes" : "Add Tour Service"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddTourService;
