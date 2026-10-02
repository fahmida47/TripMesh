import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpcomingBookings.css";
import { API_BASE_URL } from "../../../config.js";
import { getToken } from "../../../utils/auth.js";



function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatDateRange(booking) {
  const serviceRequest = booking.service_request || booking.serviceRequest;
  const fromDate = booking.from_date || serviceRequest?.from_date;
  const toDate = booking.to_date || serviceRequest?.to_date;

  if (!fromDate) return "Date not set";
  if (!toDate || fromDate === toDate) return formatDate(fromDate);
  return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}

const UpcomingBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadBookings = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Please sign in again to view bookings.");
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
          throw new Error(data.message || "Unable to load bookings.");
        }

        const latestBookings = Array.isArray(data.bookings) ? data.bookings : [];
        setBookings(latestBookings.slice(0, 3));
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load bookings.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadBookings();
    return () => controller.abort();
  }, []);

  const handleViewAll = () => {
    navigate("/guide-dashboard/bookings");
  };

  return (
    <section className="upcoming-bookings-card">
      <div className="upcoming-bookings-header">
        <h3>Bookings</h3>

        <button
          type="button"
          className="booking-view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="upcoming-bookings-empty">
          <p>Loading bookings...</p>
          <span>Fetching your latest bookings.</span>
        </div>
      ) : error ? (
        <div className="upcoming-bookings-empty" role="alert">
          <p>Unable to load bookings</p>
          <span>{error}</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="upcoming-bookings-empty">
          <p>No bookings yet</p>
          <span>Accepted tour requests will appear here.</span>
        </div>
      ) : (
        <div className="upcoming-bookings-list">
          {bookings.map((booking) => {
            const serviceRequest =
              booking.service_request || booking.serviceRequest;
            const tourService =
              serviceRequest?.tour_service || serviceRequest?.tourService;
            const travelRequest =
              booking.travel_request || booking.travelRequest;
            const touristName = booking.tourist?.full_name
              || booking.tourist?.user?.name
              || "Tourist";
            const tourName = booking.experience?.title
              || tourService?.title
              || serviceRequest?.experience_name
              || travelRequest?.experience_name
              || "Tour booking";
            const status = (booking.status || "pending_payment").replaceAll("_", " ");

            return (
              <article className="upcoming-booking-item" key={booking.id}>
                <div className="upcoming-booking-main">
                  <div className="upcoming-booking-copy">
                    <strong>{tourName}</strong>
                    <span>{touristName}</span>
                    <small>{formatDateRange(booking)}</small>
                  </div>
                  <span className={`upcoming-booking-status ${booking.status || "pending_payment"}`}>
                    {status}
                  </span>
                </div>
                <div className="upcoming-booking-meta">
                  <span>
                    {tourService?.location
                      || serviceRequest?.destination
                      || travelRequest?.destination
                      || "Destination not specified"}
                  </span>
                  <strong>
                    ৳{Number(booking.amount || 0).toLocaleString("en-BD")}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UpcomingBookings;
