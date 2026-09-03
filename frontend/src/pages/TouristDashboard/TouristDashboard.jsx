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

  const goToPayment = (booking, from) => {
    setPaymentTarget({
      booking,
      from,
    });

    setActiveKey("complete-payment");
  };

  const handleBackFromPayment = () => {
    setActiveKey(paymentTarget?.from || "bookings");
    setPaymentTarget(null);
  };

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">
        {/* =========================
            TOURIST SIDEBAR
        ========================= */}
        <TouristSidebar
          activeKey={activeKey}
          onNavigate={setActiveKey}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* =========================
            MAIN AREA
        ========================= */}
        <div className="ts-shell-main">
          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={() => navigate("/tourist-dashboard/profile")}
          />

          <main className="ts-shell-content">
            {/* PAYMENT PAGE */}
            {isCompletePayment && (
              <PaymentPage
                booking={paymentTarget?.booking}
                backLabel={
                  paymentTarget?.from === "payments"
                    ? "Back to Payments"
                    : "Back to My Requests"
                }
                onBack={handleBackFromPayment}
              />
            )}

            {/* BOOKINGS */}
            {isRequestsBookings && (
              <RequestsBookings
                onProceedToPayment={(booking) =>
                  goToPayment(booking, "bookings")
                }
              />
            )}

            {/* PAYMENTS */}
            {isPayments && (
              <PaymentHistory
                onPayNow={(booking) => goToPayment(booking, "payments")}
              />
            )}

            {/* DASHBOARD / EXPLORE */}
            {!isCompletePayment &&
              !isRequestsBookings &&
              !isPayments && <Explore embedded />}
          </main>
        </div>
      </div>
    </div>
  );
}
