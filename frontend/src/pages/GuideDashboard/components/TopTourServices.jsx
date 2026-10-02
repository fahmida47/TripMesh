import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, STORAGE_URL } from "../../../config.js";
import { getToken } from "../../../utils/auth.js";
import "./TopTourServices.css";

const TopTourServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const loadTopServices = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Please sign in again to view your tour services.");
        }

        const response = await fetch(`${API_BASE_URL}/bookings/guide`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load tour service bookings.");
        }

        const bookings = Array.isArray(data.bookings) ? data.bookings : [];
        const groupedServices = new Map();

        bookings.forEach((booking) => {
          const serviceRequest =
            booking.service_request || booking.serviceRequest;
          const service =
            serviceRequest?.tour_service || serviceRequest?.tourService;

          if (!serviceRequest && !service) return;

          const key =
            service?.id ??
            serviceRequest?.tour_service_id ??
            serviceRequest?.id ??
            serviceRequest?.experience_name ??
            booking.id;
          const current = groupedServices.get(key);

          if (current) {
            current.bookingCount += 1;
            return;
          }

          groupedServices.set(key, {
            id: key,
            title: service?.title || serviceRequest?.experience_name || "Tour service",
            location: service?.location || serviceRequest?.destination || "",
            price: service?.price ?? serviceRequest?.amount ?? booking.amount,
            image: service?.image || "",
            bookingCount: 1,
          });
        });

        setServices(
          [...groupedServices.values()]
            .sort((a, b) => b.bookingCount - a.bookingCount)
            .slice(0, 3)
        );
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load tour service bookings.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTopServices();
    return () => controller.abort();
  }, []);

  const imageUrl = (image) => {
    if (!image) return "";
    return /^https?:\/\//i.test(image) ? image : `${STORAGE_URL}/${image}`;
  };

  const handleManageAll = () => {
    navigate("/guide-dashboard/tour-services");
  };

  return (
    <section className="top-tour-services-card">
      <div className="top-tour-services-header">
        <h3>Your Top Tour Services</h3>

        <button
          type="button"
          className="manage-all-btn"
          onClick={handleManageAll}
        >
          Manage All
        </button>
      </div>

      {loading ? (
        <div className="top-tour-services-empty">
          <p>Loading tour services...</p>
        </div>
      ) : error ? (
        <div className="top-tour-services-empty" role="alert">
          <p>Unable to load tour services</p>
          <span>{error}</span>
        </div>
      ) : services.length === 0 ? (
        <div className="top-tour-services-empty">
          <p>No booking data yet</p>
          <span>Your most booked tour services will appear here.</span>
        </div>
      ) : (
        <div className="top-tour-services-list">
          {services.map((service) => (
            <article className="top-tour-service-item" key={service.id}>
              <div className="top-tour-service-info">
                {service.image && !failedImages[service.id] ? (
                  <img
                    src={imageUrl(service.image)}
                    alt=""
                    onError={() => {
                      setFailedImages((images) => ({
                        ...images,
                        [service.id]: true,
                      }));
                    }}
                  />
                ) : (
                  <span className="top-tour-service-placeholder" aria-hidden="true">
                    {service.title.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="top-tour-service-text">
                  <strong>{service.title}</strong>
                  <span>{service.location}</span>
                </div>
              </div>
              <strong className="top-tour-service-price">
                ৳{Number(service.price || 0).toLocaleString("en-BD")}
              </strong>
              <span className="top-tour-service-bookings">
                {service.bookingCount} {service.bookingCount === 1 ? "booking" : "bookings"}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopTourServices;
