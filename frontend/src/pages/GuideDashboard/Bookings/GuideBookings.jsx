import { useState } from "react";

import "./GuideBookings.css";

import GuideSidebar from "../components/GuideSidebar";
import GuideHeader from "../components/GuideHeader";

function GuideBookings() {
  // No mock data
  const [bookings] = useState([]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  return (
    <div className="guide-dashboard">
      <GuideSidebar />

      <div className="dashboard-content">
        <GuideHeader />

        <main className="guide-bookings-page">
          <div className="guide-bookings-heading">
            <h1>Bookings</h1>
            <p>View the booking status of your accepted tour requests.</p>
          </div>

          {/* SUMMARY CARDS */}
          <section className="booking-summary-grid">
            <div className="booking-summary-card">
              <span>Total Bookings</span>
              <h2>{totalBookings}</h2>
            </div>

            <div className="booking-summary-card">
              <span>Pending</span>
              <h2>{pendingBookings}</h2>
            </div>

            <div className="booking-summary-card">
              <span>Completed</span>
              <h2>{completedBookings}</h2>
            </div>

            <div className="booking-summary-card">
              <span>Cancelled</span>
              <h2>{cancelledBookings}</h2>
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
            </div>

            {bookings.length === 0 ? (
              <div className="bookings-empty-state">
                <div className="bookings-empty-icon">📅</div>

                <h2>No bookings yet</h2>

                <p>
                  Accepted tour requests will appear here when booking activity
                  starts.
                </p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div className="booking-row" key={booking.id}>
                    <div className="booking-customer">
                      <strong>{booking.customerName}</strong>
                    </div>

                    <div className="booking-tour">
                      <strong>{booking.tourTitle}</strong>
                      <span>{booking.destination}</span>
                    </div>

                    <span>{booking.tourDate}</span>

                    <span>{booking.travelers}</span>

                    <strong>৳ {booking.amount}</strong>

                    <span
                      className={`booking-status ${booking.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default GuideBookings;
