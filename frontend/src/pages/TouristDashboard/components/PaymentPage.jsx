import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import PaymentMethodSelector, {
  PAYMENT_METHODS,
} from "./PaymentMethodSelector";

import PaymentForm from "./PaymentForm";
import PaymentBookingSummary from "./PaymentBookingSummary";
import PaymentSuccess from "./PaymentSuccess";
import TouristSidebar from "./TouristSidebar";

import "./PaymentPage.css";

export default function PaymentPage({
  booking,
  backLabel,
  onBack,
  onSubmit,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Booking can come from props or navigation state
  const selectedBooking =
    booking || location.state?.booking;

  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] =
    useState("");
  const [paymentDateTime, setPaymentDateTime] =
    useState("");
  const [confirmed, setConfirmed] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ================================
  // PAYMENT METHOD LABEL
  // ================================
  const methodLabel =
    PAYMENT_METHODS.find(
      (item) => item.id === method
    )?.label || "bKash";

  // ================================
  // SUBMIT VALIDATION
  // ================================
  const canSubmit =
    confirmed &&
    accountNumber.trim() !== "" &&
    paymentDateTime !== "";

  // ================================
  // DIRECT PAYMENT API
  // ================================
  const submitDirectPayment = async (
    paymentData
  ) => {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "http://127.0.0.1:8000/api/payments/complete",
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          booking_id: paymentData.bookingId,
          method: paymentData.method,
          account_number:
            paymentData.accountNumber,
          payment_date_time:
            paymentData.paymentDateTime,
        }),
      }
    );

    const responseData =
      await response.json();

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          "Unable to submit payment."
      );
    }
  };

  // ================================
  // HANDLE PAYMENT SUBMIT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);

    try {
      await (
        onSubmit || submitDirectPayment
      )({
        bookingId: selectedBooking?.id,
        method,
        accountNumber,
        paymentDateTime,
      });

      setSubmitted(true);
    } catch (error) {
      window.alert(
        error?.message ||
          "Unable to submit payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // HANDLE BACK
  // ================================
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(
      location.state?.from ||
        "/tourist-dashboard/bookings"
    );
  };

  // ================================
  // PAYMENT SUCCESS PAGE
  // ================================
  if (submitted) {
    return (
      <div className="cp-shell">
        <TouristSidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <main className="cp-content">
          <div className="cp-page">
            <PaymentSuccess
              booking={selectedBooking}
              method={methodLabel}
              accountNumber={accountNumber}
              backLabel={
                backLabel ||
                "Back to My Requests"
              }
              onBack={handleBack}
            />
          </div>
        </main>
      </div>
    );
  }

  // ================================
  // PAYMENT PAGE
  // ================================
  return (
    <div className="cp-shell">
      <TouristSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="cp-content">
        <div className="cp-page">

          {/* ================================
              HEADER
          ================================= */}
          <div className="cp-header">
            {(onBack ||
              location.state?.from) && (
              <button
                type="button"
                className="cp-back-btn"
                onClick={handleBack}
              >
                <FiArrowLeft
                  aria-hidden="true"
                />

                {backLabel || "Back"}
              </button>
            )}

            <h1>
              Complete Your Payment
            </h1>

            <p>
              Please complete your payment to
              confirm your booking.
            </p>
          </div>

          {/* ================================
              PAYMENT GRID
          ================================= */}
          <form
            className="cp-grid"
            onSubmit={handleSubmit}
          >

            {/* ================================
                LEFT: PAYMENT FORM
            ================================= */}
            <div className="cp-main">
              <PaymentMethodSelector
                method={method}
                onChange={setMethod}
              />

              <PaymentForm
                methodLabel={methodLabel}
                accountNumber={accountNumber}
                onAccountNumberChange={
                  setAccountNumber
                }
                paymentDateTime={
                  paymentDateTime
                }
                onPaymentDateTimeChange={
                  setPaymentDateTime
                }
                confirmed={confirmed}
                onConfirmedChange={
                  setConfirmed
                }
                canSubmit={canSubmit}
                submitting={submitting}
              />
            </div>

            {/* ================================
                RIGHT: BOOKING SUMMARY
            ================================= */}
            <PaymentBookingSummary
              booking={selectedBooking}
            />

          </form>
        </div>
      </main>
    </div>
  );
}