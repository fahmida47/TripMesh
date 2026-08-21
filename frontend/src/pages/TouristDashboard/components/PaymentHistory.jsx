import { useEffect, useRef, useState } from "react";
import { FiCreditCard } from "react-icons/fi";

import { ChevronLeftIcon, ChevronRightIcon } from "./NavIcons";
import TouristStatCard from "./TouristStatCard";
import PaymentCard from "./PaymentCard";
import PaymentDetailsModal from "./PaymentDetailsModal";

import "./PaymentHistory.css";

const PAGE_SIZE = 5;

// No mock data — this list starts empty and will be filled from the
// backend once the tourist is logged in and payments are fetched from the API.
const PAYMENTS = [];

/**
 * "Payments" — opened from the sidebar's "Payments" nav item.
 * Overview cards only show counts (no amounts) until payments are wired up
 * to the backend. Every "Pay Now" entry point here (the row action, the
 * details modal, and the "Make a Payment" quick-pay card) routes to the
 * same PaymentPage via `onPayNow`, passed down from TouristDashboard.
 */
export default function PaymentHistory({ onPayNow }) {
  const [payments] = useState(PAYMENTS);
  const [page, setPage] = useState(1);
  const [activePayment, setActivePayment] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const totalPayments = payments.length;

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = payments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const rangeStart = payments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, payments.length);

  // "Make a Payment" quick-pay card has no booking of its own — if there's
  // a pending payment in the list it uses that, otherwise it still opens
  // PaymentPage (Booking Summary will just show "No booking selected").
  const firstPending = payments.find((p) => p.status === "Pending");

  const handlePayNow = (payment) => {
    onPayNow?.(payment);
  };

  const handleQuickPay = () => {
    if (!firstPending) {
      showToast("No specific booking selected — opening the payment page.");
    }
    handlePayNow(firstPending || null);
  };

  return (
    <div className="pm-page">
      <div className="pm-header">
        <h1>Payments</h1>
        <p>View your all tour payments and their status.</p>
      </div>

      <section className="pm-stats" aria-label="Payment overview">
        <TouristStatCard
          icon={FiCreditCard}
          tone="blue"
          label="Total Payments"
          value={totalPayments}
          description="All time"
        />

        <article className="pm-pay-card">
          <div className="pm-pay-card-icon">
            <FiCreditCard aria-hidden="true" />
          </div>

          <div className="pm-pay-card-body">
            <p className="pm-pay-card-label">Make a Payment</p>
            <p className="pm-pay-card-desc">Pay for your pending tour bookings</p>
          </div>

          <button
            type="button"
            className="pm-btn pm-btn--primary"
            onClick={handleQuickPay}
          >
            <FiCreditCard aria-hidden="true" /> Pay Now
          </button>
        </article>
      </section>

      <section className="pm-panel" aria-label="Payment history" id="payment-history">
        <div className="pm-panel-header">
          <div className="pm-panel-title">
            <h2>Payment History</h2>
            <span className="pm-count-pill">{payments.length} Payments</span>
          </div>
        </div>

        <div className="pm-col-header">
          <span>Tour &amp; Company</span>
          <span>Destination</span>
          <span>Payment Date</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}></span>
        </div>

        <div className="pm-list">
          {pageItems.length === 0 ? (
            <p className="pm-empty">No payments yet.</p>
          ) : (
            pageItems.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onViewDetails={setActivePayment}
                onPayNow={handlePayNow}
              />
            ))
          )}
        </div>

        <div className="pm-footer">
          <span className="pm-footer-text">
            Showing {rangeStart} to {rangeEnd} of {payments.length} payments
          </span>

          <div className="pm-pager">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon width={14} height={14} />
            </button>

            <button type="button" className="active">
              {currentPage}
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRightIcon width={14} height={14} />
            </button>
          </div>
        </div>
      </section>

      {activePayment && (
        <PaymentDetailsModal
          payment={activePayment}
          onClose={() => setActivePayment(null)}
          onPayNow={handlePayNow}
        />
      )}

      {toast && (
        <div className="pm-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
