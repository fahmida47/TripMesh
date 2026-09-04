import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";
import RequestsBookings from "./components/RequestsBookings";
import PaymentHistory from "./components/PaymentHistory";
import PaymentPage from "./components/PaymentPage";
import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

export default function TouristDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  // Stores the booking/payment that opened the payment page
  const [paymentTarget, setPaymentTarget] = useState(null);

  const isRequestsBookings = activeKey === "bookings";
  const isPayments = activeKey === "payments";
  const isCompletePayment = activeKey === "complete-payment";

  // Get authentication token
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token")
    );
  };

  // Open payment page with complete booking information
  const goToPayment = async (booking, from) => {
    if (!booking?.id) {
      console.error("Booking ID not found.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/bookings/${booking.id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load booking."
        );
      }

      console.log("Payment booking:", data.booking);

      setPaymentTarget({
        booking: data.booking,
        from: from,
      });

      setActiveKey("complete-payment");
    } catch (error) {
      console.error("Failed to load booking:", error);

      // Fallback: use the booking already received
      setPaymentTarget({
        booking: booking,
        from: from,
      });

      setActiveKey("complete-payment");
    }
  };

  // Go back from payment page
  const handleBackFromPayment = () => {
    setActiveKey(paymentTarget?.from || "bookings");
    setPaymentTarget(null);
  };

  // Submit payment
  const submitPayment = async ({
    bookingId,
    method,
    accountNumber,
    paymentDateTime,
    transactionReference,
  }) => {
    const token = getToken();

    if (!token) {
      throw new Error("Authentication token not found.");
    }

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
          booking_id: bookingId,
          method: method,
          account_number: accountNumber,
          payment_date_time: paymentDateTime,
          transaction_reference: transactionReference,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to submit payment."
      );
    }

    setPaymentTarget((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        booking: data.booking,
      };
    });
  };

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">

        {/* Tourist Sidebar */}
        <TouristSidebar
          activeKey={activeKey}
          onNavigate={setActiveKey}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Area */}
        <div className="ts-shell-main">

          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={() =>
              navigate("/tourist-dashboard/profile")
            }
          />

          <main className="ts-shell-content">

            {/* Payment Page */}
            {isCompletePayment && (
              <PaymentPage
                booking={paymentTarget?.booking}
                backLabel={
                  paymentTarget?.from === "payments"
                    ? "Back to Payments"
                    : "Back to My Requests"
                }
                onBack={handleBackFromPayment}
                onSubmit={submitPayment}
              />
            )}

            {/* My Requests / Bookings */}
            {isRequestsBookings && (
              <RequestsBookings
                onProceedToPayment={(booking) =>
                  goToPayment(booking, "bookings")
                }
              />
            )}

            {/* Payment History */}
            {isPayments && (
              <PaymentHistory
                onPayNow={(booking) =>
                  goToPayment(booking, "payments")
                }
              />
            )}

            {/* Dashboard / Explore */}
            {!isCompletePayment &&
              !isRequestsBookings &&
              !isPayments && <Explore embedded />}

          </main>
        </div>
      </div>
    </div>
  );
}