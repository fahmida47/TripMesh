import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TouristSidebar from "./components/TouristSidebar";
import TouristTopbar from "./components/TouristTopbar";

import RequestsBookings from "./components/RequestsBookings";
import TouristProfile from "./Profile/TouristProfile";
import PaymentHistory from "./components/PaymentHistory";
import PaymentPage from "./components/PaymentPage";
import TouristReviews from "./Reviews/TouristReviews";

import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

export default function TouristDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     FIND ACTIVE PAGE FROM URL
  ========================= */

  const getActiveKey = () => {
    const path = location.pathname;

    if (path === "/tourist-dashboard/profile") {
      return "profile";
    }

    if (path === "/tourist-dashboard/bookings") {
      return "bookings";
    }

    if (path === "/tourist-dashboard/payments") {
      return "payments";
    }

    if (path === "/tourist-dashboard/reviews") {
      return "reviews";
    }

    if (path === "/tourist-dashboard/payment") {
      return "complete-payment";
    }

    return "dashboard";
  };

  const activeKey = getActiveKey();

  /* =========================
     PAYMENT
  ========================= */

  const goToPayment = (booking, from) => {
    setPaymentTarget({
      booking,
      from,
    });

    navigate("/tourist-dashboard/payment");
  };

  const handleBackFromPayment = () => {
    const destination = paymentTarget?.from || "bookings";

    if (destination === "payments") {
      navigate("/tourist-dashboard/payments");
    } else {
      navigate("/tourist-dashboard/bookings");
    }

    setPaymentTarget(null);
  };

  /* =========================
     CLOSE SIDEBAR ON PAGE CHANGE
  ========================= */

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* =========================
     NAVIGATION
  ========================= */

  const handleNavigate = (key) => {
    switch (key) {
      case "dashboard":
        navigate("/tourist-dashboard");
        break;

      case "profile":
        navigate("/tourist-dashboard/profile");
        break;

      case "bookings":
        navigate("/tourist-dashboard/bookings");
        break;

      case "payments":
        navigate("/tourist-dashboard/payments");
        break;

      case "reviews":
        navigate("/tourist-dashboard/reviews");
        break;

      default:
        navigate("/tourist-dashboard");
    }
  };

  return (
    <div className="ts-shell">
      <div className="ts-shell-body">
        {/* =========================
            TOURIST SIDEBAR
        ========================= */}

        <TouristSidebar
          activeKey={activeKey}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* =========================
            MAIN AREA
        ========================= */}

        <div className="ts-shell-main">
          {/* TOPBAR */}

          <TouristTopbar
            onMenuClick={() => setSidebarOpen(true)}
            onProfileClick={() => navigate("/tourist-dashboard/profile")}
          />

          {/* =========================
              PAGE CONTENT
          ========================= */}

          <main className="ts-shell-content">
            {/* =========================
                PROFILE
            ========================= */}

            {activeKey === "profile" && <TouristProfile />}

            {/* =========================
                COMPLETE PAYMENT
            ========================= */}

            {activeKey === "complete-payment" && (
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

            {/* =========================
                BOOKINGS
            ========================= */}

            {activeKey === "bookings" && (
              <RequestsBookings
                onProceedToPayment={(booking) =>
                  goToPayment(booking, "bookings")
                }
              />
            )}

            {/* =========================
                PAYMENTS
            ========================= */}

            {activeKey === "payments" && (
              <PaymentHistory
                onPayNow={(booking) => goToPayment(booking, "payments")}
              />
            )}

            {/* =========================
                REVIEWS
            ========================= */}

            {activeKey === "reviews" && <TouristReviews />}

            {/* =========================
                DASHBOARD
            ========================= */}

            {activeKey === "dashboard" && <Explore embedded />}
          </main>
        </div>
      </div>
    </div>
  );
}
