import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config.js";
import { getToken } from "../../../utils/auth.js";

import "./GuideTourServices.css";

function GuideTourServices() {
  const navigate = useNavigate();

  // No mock data
  const [tourServices, setTourServices] = useState([]);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/guide/tour-services`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load tour services.");
      setTourServices(data.services || []);
    } catch (err) { setError(err.message); }
  };

  useEffect(() => { loadServices(); }, []);

  const handleAddTourService = () => {
    navigate("/guide-dashboard/tour-services/add");
  };

  const handleEditService = (id) => {
    navigate(`/guide-dashboard/tour-services/edit/${id}`);
  };

  const handleDeleteService = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tour service?",
    );

    if (!confirmed) return;

    fetch(`${API_BASE_URL}/guide/tour-services/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json", Authorization: `Bearer ${getToken()}` },
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete service.");
      await loadServices();
    }).catch((err) => setError(err.message));
  };

  return (
    <main className="tour-services-page">
      {error && <p role="alert">{error}</p>}
      {/* PAGE HEADER */}
      <div className="tour-services-header">
        <div>
          <h1>Tour Services</h1>
          <p>Manage all your tour services and packages.</p>
        </div>

        <button
          type="button"
          className="add-tour-service-button"
          onClick={handleAddTourService}
        >
          + Add New Tour Service
        </button>
      </div>

      {/* SUMMARY */}
      <section className="tour-service-summary">
        {/* TOTAL SERVICES */}
        <div className="total-services-card">
          <div className="total-services-icon">🧳</div>

          <div>
            <p>Total Services</p>
            <h2>{tourServices.length}</h2>
            <span>All your tour services</span>
          </div>
        </div>

        {/* TOP TOUR SERVICE */}
        <div className="top-tour-service-card">
          <div className="top-tour-service-title">
            <div>
              <p>Top Tour Service</p>

              <h3>
                {tourServices.length === 0
                  ? "Not yet available"
                  : "No booking data yet"}
              </h3>
            </div>

            <button
              type="button"
              className="top-tour-view-all"
              onClick={() => navigate("/guide-dashboard/tour-services")}
            >
              View All
            </button>
          </div>

          <p className="top-tour-empty-text">
            Your most booked tour service will appear here.
          </p>
        </div>
      </section>

      {/* TOUR SERVICES LIST */}
      <section className="tour-services-list-card">
        <div className="tour-services-table-header">
          <span>Tour Service</span>
          <span>Tour Type</span>
          <span>Duration</span>
          <span>Price (BDT)</span>
          <span>Actions</span>
        </div>

        {tourServices.length === 0 ? (
          <div className="tour-services-empty-state">
            <div className="tour-services-empty-icon">🗺️</div>

            <h2>No tour services added yet</h2>

            <p>Add your first tour service to start creating packages.</p>

            <button type="button" onClick={handleAddTourService}>
              + Add Tour Service
            </button>
          </div>
        ) : (
          <div className="tour-services-list">
            {tourServices.map((service) => (
              <div className="tour-service-row" key={service.id}>
                {/* TOUR SERVICE */}
                <div className="tour-service-name">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="tour-service-list-image"
                    />
                  )}

                  <div>
                    <strong>{service.title}</strong>
                    <span>{service.location}</span>
                  </div>
                </div>

                {/* TOUR TYPE */}
                <span>{service.tour_type}</span>

                {/* DURATION */}
                <span>{service.duration}</span>

                {/* PRICE */}
                <strong>৳ {service.price}</strong>

                {/* ACTIONS */}
                <div className="tour-service-actions">
                  <button
                    type="button"
                    className="edit-service-btn"
                    onClick={() => handleEditService(service.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-service-btn"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default GuideTourServices;
