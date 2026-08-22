import { useEffect, useRef, useState } from "react";
import { FiCreditCard } from "react-icons/fi";

import { ChevronLeftIcon, ChevronRightIcon } from "./NavIcons";
import TouristStatCard from "./TouristStatCard";
import PaymentCard from "./PaymentCard";
import PaymentDetailsModal from "./PaymentDetailsModal";
import PaymentPage from "./PaymentPage";
import TouristSidebar from "./TouristSidebar";

import "./PaymentHistory.css";

const PAGE_SIZE = 5;

// No mock data.
// This will be replaced with backend/API data later.
const PAYMENTS = [];

export default function PaymentHistory({ onPayNow }) {
  const [payments] = useState(PAYMENTS);

  const [page, setPage] = useState(1);

  const [activePayment, setActivePayment] = useState(null);

  // Controls whether Complete Your Payment page is visible
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  // Stores the payment/booking that triggered Pay Now
  const [paymentBooking, setPaymentBooking] = useState(null);

  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);

  // ==============================
  // TOAST
  // ==============================

  const showToast = (message) => {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
    };
  }, []);

  // ==============================
  // PAGINATION
  // ==============================

  const totalPayments = payments.length;

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const pageItems = payments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const rangeStart =
    payments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const rangeEnd = Math.min(currentPage * PAGE_SIZE, payments.length);

  // ==============================
  // FIND PENDING PAYMENT
  // ==============================

  const firstPending = payments.find((payment) => payment.status === "Pending");

  // ==============================
  // PAY NOW
  // ==============================

  const handlePayNow = (payment) => {
    // Keep the parent callback if one exists
    onPayNow?.(payment);

    // Store selected payment/booking
    setPaymentBooking(payment || null);

    // Open payment page
    setShowPaymentPage(true);
  };

  // ==============================
  // QUICK PAY
  // ==============================

  const handleQuickPay = () => {
    if (!firstPending) {
      showToast("No specific booking selected — opening the payment page.");
    }

    handlePayNow(firstPending || null);
  };

  // ==============================
  // BACK FROM PAYMENT PAGE
  // ==============================

  const handlePaymentBack = () => {
    setShowPaymentPage(false);
    setPaymentBooking(null);
  };

  // ==============================
  // PAYMENT SUBMIT
  // ==============================

  const handlePaymentSubmit = (data) => {
    console.log("Payment submitted:", data);

    showToast("Payment information submitted successfully.");
  };

  // =====================================================
  // IMPORTANT:
  // SHOW PAYMENT PAGE INSTEAD OF PAYMENT HISTORY
  // =====================================================

  if (showPaymentPage) {
    return (
      <PaymentPage
        booking={paymentBooking}
        backLabel="Back to Payments"
        onBack={handlePaymentBack}
        onSubmit={handlePaymentSubmit}
      />
    );
  }

  // ==============================
  // PAYMENT HISTORY PAGE
  // ==============================

  return (
    <>
      {/* TOURIST SIDEBAR */}
      <TouristSidebar />

      {/* PAYMENT CONTENT */}
      <div className="pm-page">
        {/* ==============================
            HEADER
        ============================== */}

        <div className="pm-header">
          <h1>Payments</h1>

          <p>View your all tour payments and their status.</p>
        </div>

        {/* ==============================
            PAYMENT STATS
        ============================== */}

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

              <p className="pm-pay-card-desc">
                Pay for your pending tour bookings
              </p>
            </div>

            <button
              type="button"
              className="pm-btn pm-btn--primary"
              onClick={handleQuickPay}
            >
              <FiCreditCard aria-hidden="true" />
              Pay Now
            </button>
          </article>
        </section>

        {/* ==============================
            PAYMENT HISTORY
        ============================== */}

        <section
          className="pm-panel"
          aria-label="Payment history"
          id="payment-history"
        >
          {/* PANEL HEADER */}

          <div className="pm-panel-header">
            <div className="pm-panel-title">
              <h2>Payment History</h2>

              <span className="pm-count-pill">{payments.length} Payments</span>
            </div>
          </div>

          {/* ==============================
              COLUMN HEADER
          ============================== */}

          <div className="pm-col-header">
            <span>Tour &amp; Company</span>

            <span>Destination</span>

            <span>Payment Date</span>

            <span>Status</span>

            <span
              style={{
                textAlign: "right",
              }}
            />
          </div>

          {/* ==============================
              PAYMENT LIST
          ============================== */}

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

          {/* ==============================
              FOOTER
          ============================== */}

          <div className="pm-footer">
            <span className="pm-footer-text">
              Showing {rangeStart} to {rangeEnd} of {payments.length} payments
            </span>

            <div className="pm-pager">
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeftIcon width={14} height={14} />
              </button>

              {/* CURRENT PAGE */}

              <button type="button" className="active">
                {currentPage}
              </button>

              {/* NEXT */}

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

        {/* ==============================
            PAYMENT DETAILS MODAL
        ============================== */}

        {activePayment && (
          <PaymentDetailsModal
            payment={activePayment}
            onClose={() => setActivePayment(null)}
            onPayNow={handlePayNow}
          />
        )}

        {/* ==============================
            TOAST
        ============================== */}

        {toast && (
          <div className="pm-toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
