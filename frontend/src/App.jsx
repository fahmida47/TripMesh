import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";

import { getLoggedInUser } from "./utils/auth";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage";

import Explore from "./pages/Explore/Explore";

import Login from "./pages/Login/Login";

import Signup from "./pages/Signup/Signup";

import AboutUs from "./pages/AboutUs/AboutUs";

import Contact from "./pages/Contact/Contact";

/* =========================
   GUIDE DASHBOARD
========================= */

import GuideLayout from "./pages/GuideDashboard/GuideLayout";

import GuideDashboard from "./pages/GuideDashboard/GuideDashboard";

import GuideProfile from "./pages/GuideDashboard/Profile/GuideProfile";

import GuideTourServices from "./pages/GuideDashboard/TourServices/GuideTourServices";

import AddTourService from "./pages/GuideDashboard/TourServices/AddTourService";

import GuideRequests from "./pages/GuideDashboard/GuideRequest/GuideRequests";

import GuideBookings from "./pages/GuideDashboard/Bookings/GuideBookings";

import GuidePayouts from "./pages/GuideDashboard/Payouts/GuidePayouts";

import ReviewsRatings from "./pages/GuideDashboard/Rating/ReviewsRatings";

/* =========================
   TOURIST DASHBOARD
========================= */

import TouristDashboard from "./pages/TouristDashboard/TouristDashboard";

import TouristProfile from "./pages/TouristDashboard/Profile/TouristProfile";

import TouristReviews from "./pages/TouristDashboard/Reviews/TouristReviews";

import RequestsBookings from "./pages/TouristDashboard/components/RequestsBookings";

import PaymentHistory from "./pages/TouristDashboard/components/PaymentHistory";

import PaymentPage from "./pages/TouristDashboard/components/PaymentPage";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard, {
  AdminGuard,
  AdminOverview,
  AdminList,
  AdminPayments,
  AdminCommissions,
  AdminReviews,
  AdminProfile,
} from "./pages/Admin/AdminDashboard";

/* =========================
   AUTH / ROLE ROUTING
========================= */

const ROLE_HOME = {
  guide: "/guide-dashboard",
  tourist: "/tourist-dashboard",
  admin: "/admin/dashboard",
};

/* Public pages (landing, login, signup): signed-in users go to their dashboard */
function PublicOnly({ children }) {
  const user = getLoggedInUser();

  if (user && ROLE_HOME[user.role]) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return children;
}

/* Dashboards: only the matching role may enter */
function ProtectedDashboard({ children, role }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === role) {
    return children;
  }

  // Wrong role -> own dashboard. Unknown role -> login (never the protected page).
  return <Navigate to={ROLE_HOME[user.role] ?? "/login"} replace />;
}

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================= */}

        {/* Landing Page */}
        <Route path="/" element={<PublicOnly><GlobalLandingPage /></PublicOnly>} />

        {/* Explore */}
        <Route path="/explore" element={<Explore />} />

        {/* About */}
        <Route path="/about" element={<AboutUs />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Login */}
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />

        {/* Signup */}
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="commissions" element={<AdminCommissions />} />
          <Route path="bookings" element={<AdminList kind="bookings" />} />
          <Route path="guides" element={<AdminList kind="guides" />} />
          <Route path="tourists" element={<AdminList kind="tourists" />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* =========================
            GUIDE DASHBOARD
        ========================= */}

        <Route
          path="/guide-dashboard"
          element={
            <ProtectedDashboard role="guide">
              <GuideLayout />
            </ProtectedDashboard>
          }
        >
          {/* /guide-dashboard */}
          <Route index element={<GuideDashboard />} />

          {/* /guide-dashboard/profile */}
          <Route path="profile" element={<GuideProfile />} />

          {/* /guide-dashboard/tour-services */}
          <Route
            path="tour-services"
            element={<GuideTourServices />}
          />

          {/* /guide-dashboard/tour-services/add */}
          <Route
            path="tour-services/add"
            element={<AddTourService />}
          />

          {/* /guide-dashboard/requests */}
          <Route
            path="requests"
            element={<GuideRequests />}
          />

          {/* /guide-dashboard/bookings */}
          <Route
            path="bookings"
            element={<GuideBookings />}
          />

          {/* /guide-dashboard/payouts */}
          <Route
            path="payouts"
            element={<GuidePayouts />}
          />

          {/* /guide-dashboard/reviews */}
          <Route
            path="reviews"
            element={<ReviewsRatings />}
          />
        </Route>

        {/* =========================
            TOURIST DASHBOARD
        ========================= */}

        <Route
          path="/tourist-dashboard"
          element={
            <ProtectedDashboard role="tourist">
              <TouristDashboard />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/tourist-dashboard/profile"
          element={
            <ProtectedDashboard role="tourist">
              <TouristProfile />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/tourist-dashboard/bookings"
          element={
            <ProtectedDashboard role="tourist">
              <RequestsBookings />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/tourist-dashboard/payments"
          element={
            <ProtectedDashboard role="tourist">
              <PaymentHistory />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/tourist-dashboard/payment"
          element={
            <ProtectedDashboard role="tourist">
              <PaymentPage />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/tourist-dashboard/reviews"
          element={
            <ProtectedDashboard role="tourist">
              <TouristReviews />
            </ProtectedDashboard>
          }
        />

        {/* =========================
            PAGE NOT FOUND
        ========================= */}

        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h2>Page Not Found</h2>

              <Link to="/">Go to Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
