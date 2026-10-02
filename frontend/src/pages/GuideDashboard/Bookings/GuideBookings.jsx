import { useEffect, useState } from "react";
import "./GuideBookings.css";
import { API_BASE_URL } from "../../../config.js";
import { getToken } from "../../../utils/auth.js";



function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function formatDateRange(booking) {
  const start = formatDate(booking.from_date);
  const end = formatDate(booking.to_date);
  return start === end ? start : `${start} – ${end}`;
}

function formatAmount(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function GuideBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [bookingToComplete, setBookingToComplete] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/guide`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken() || ""}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  // Initial API load when the bookings page opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadBookings();
}, []);
  useEffect(() => {
    if (!bookingToComplete || updatingId !== null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBookingToComplete(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bookingToComplete, updatingId]);

  const completeBooking = async (booking) => {
    setUpdatingId(booking.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/guide/${booking.id}/complete`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken() || ""}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to complete this booking.");
      }

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id ? data.booking : item,
        ),
      );
      setBookingToComplete(null);
      setNotice(data.message || "Booking marked as completed.");
    } catch (requestError) {
      setError(requestError.message || "Unable to complete this booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending_payment").length;
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const completedBookings = bookings.filter((booking) => booking.status === "completed").length;

  return (
    <main className="guide-bookings-page">
      <div className="guide-bookings-heading">
        <h1>Bookings</h1>
        <p>Track accepted tour requests, payment status, and completed tours.</p>
      </div>

      {error && <p className="booking-page-message error" role="alert">{error}</p>}
      {notice && <p className="booking-page-message success" role="status">{notice}</p>}

      {/* SUMMARY CARDS */}
      <section className="booking-summary-grid">
        <div className="booking-summary-card">
          <span>Total Bookings</span>
          <h2>{totalBookings}</h2>
        </div>

        <div className="booking-summary-card">
          <span>Awaiting Payment</span>
          <h2>{pendingBookings}</h2>
        </div>

        <div className="booking-summary-card">
          <span>Confirmed</span>
          <h2>{confirmedBookings}</h2>
        </div>

        <div className="booking-summary-card">
          <span>Completed</span>
          <h2>{completedBookings}</h2>
        </div>
      </section>

      {/* BOOKINGS TABLE */}
      <section className="bookings-list-card">
        <div className="bookings-table-header">
          <span>Customer</span>
          <span>Tour Service</span>
          <span>Tour Date</span>
          <span>Travelers</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="bookings-empty-state">
            <h2>Loading bookings…</h2>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <div className="bookings-empty-icon">📅</div>

            <h2>No bookings yet</h2>

            <p>
              Accepted tour requests will appear here. Bookings awaiting payment
              stay pending until the tourist pays and admin approves it.
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div className="booking-customer">
                  <strong>
                    {booking.tourist?.full_name ||
                      booking.tourist?.user?.name ||
                      "Tourist"}
                  </strong>
                </div>

                <div className="booking-tour">
                  <strong>
                    {booking.experience?.title ||
                      booking.travel_request?.experience_name ||
                      "Tour booking"}
                  </strong>
                  <span>{booking.travel_request?.destination || "—"}</span>
                </div>

                <span>{formatDateRange(booking)}</span>

                <span>{booking.travel_request?.travelers ?? "—"}</span>

                <strong>{formatAmount(booking.amount)}</strong>

                <span
                  className={`booking-status ${booking.status.replaceAll("_", "-")}`}
                >
                  {booking.status.replaceAll("_", " ")}
                </span>

                {booking.status === "confirmed" && booking.payment?.status === "paid" ? (
                  <button
                    className="booking-complete-btn"
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => {
                      setError("");
                      setBookingToComplete(booking);
                    }}
                  >
                    {updatingId === booking.id ? "Saving…" : "Mark completed"}
                  </button>
                ) : (
                  <span className="booking-action-note">
                    {booking.status === "pending_payment"
                      ? "Waiting for payment"
                      : booking.status === "completed"
                        ? "Done"
                        : "—"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {bookingToComplete && (
        <div
          className="booking-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && updatingId === null) {
              setBookingToComplete(null);
            }
          }}
        >
          <section
            className="booking-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirm-title"
            aria-describedby="booking-confirm-description"
          >
            <div className="booking-confirm-icon" aria-hidden="true">✓</div>
            <h2 id="booking-confirm-title">Complete this booking?</h2>
            <p id="booking-confirm-description">
              Mark the paid booking for{" "}
              <strong>
                {bookingToComplete.tourist?.full_name
                  || bookingToComplete.tourist?.user?.name
                  || "this tourist"}
              </strong>{" "}
              as completed?
            </p>

            {error && <p className="booking-confirm-error" role="alert">{error}</p>}

            <div className="booking-confirm-actions">
              <button
                type="button"
                className="booking-confirm-cancel"
                disabled={updatingId === bookingToComplete.id}
                onClick={() => setBookingToComplete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="booking-confirm-submit"
                disabled={updatingId === bookingToComplete.id}
                onClick={() => completeBooking(bookingToComplete)}
              >
                {updatingId === bookingToComplete.id ? "Updating..." : "Mark completed"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default GuideBookings;
