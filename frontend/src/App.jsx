import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";

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

import ReviewsRatings from "./pages/GuideDashboard/Rating/ReviewsRatings";

/* =========================
   TOURIST DASHBOARD
========================= */

import TouristDashboard from "./pages/TouristDashboard/TouristDashboard";

import TouristProfile from "./pages/TouristDashboard/Profile/TouristProfile";

import TouristReviews from "./pages/TouristDashboard/Reviews/TouristReviews";

import RequestsBookings from "./pages/TouristDashboard/components/RequestsBookings";

import PaymentHistory from "./pages/TouristDashboard/components/PaymentHistory";

import PaymentForm from "./pages/TouristDashboard/components/PaymentForm";

import PaymentPage from "./pages/TouristDashboard/components/PaymentPage";

import ReviewForm from "./pages/TouristDashboard/Reviews/ReviewForm";

/* =========================
   AUTH HELPER
========================= */

function getLoggedInUser() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const storedUser = localStorage.getItem("user");

  if (isLoggedIn !== "true" || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    return null;
  }
}

/* =========================
   LANDING PAGE PROTECTION
========================= */

function LandingPageRedirect() {
  const user = getLoggedInUser();

  // User is NOT logged in
  if (!user) {
    return <GlobalLandingPage />;
  }

  // Logged-in Guide
  if (user.role === "guide") {
    return <Navigate to="/guide-dashboard" replace />;
  }

  // Logged-in Tourist
  if (user.role === "tourist") {
    return <Navigate to="/tourist-dashboard" replace />;
  }

  return <GlobalLandingPage />;
}

/* =========================
   LOGIN PROTECTION
========================= */

function LoginRedirect() {
  const user = getLoggedInUser();

  // Not logged in → Login page
  if (!user) {
    return <Login />;
  }

  // Guide → Guide Dashboard
  if (user.role === "guide") {
    return <Navigate to="/guide-dashboard" replace />;
  }

  // Tourist → Tourist Dashboard
  if (user.role === "tourist") {
    return <Navigate to="/tourist-dashboard" replace />;
  }

  return <Login />;
}

/* =========================
   SIGNUP PROTECTION
========================= */

function SignupRedirect() {
  const user = getLoggedInUser();

  // Not logged in → Signup page
  if (!user) {
    return <Signup />;
  }

  // Guide → Guide Dashboard
  if (user.role === "guide") {
    return <Navigate to="/guide-dashboard" replace />;
  }

  // Tourist → Tourist Dashboard
  if (user.role === "tourist") {
    return <Navigate to="/tourist-dashboard" replace />;
  }

  return <Signup />;
}

/* =========================
   PROTECTED DASHBOARD
========================= */

function ProtectedDashboard({ children, role }) {
  const user = getLoggedInUser();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role trying to access dashboard
  if (user.role !== role) {
    if (user.role === "guide") {
      return <Navigate to="/guide-dashboard" replace />;
    }

    if (user.role === "tourist") {
      return <Navigate to="/tourist-dashboard" replace />;
    }
  }

  return children;
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
        <Route path="/" element={<LandingPageRedirect />} />

        {/* Explore */}
        <Route path="/explore" element={<Explore />} />

        {/* About */}
        <Route path="/about" element={<AboutUs />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Login */}
        <Route path="/login" element={<LoginRedirect />} />

        {/* Signup */}
        <Route path="/signup" element={<SignupRedirect />} />

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
          path="/tourist-dashboard/payments/form"
          element={
            <ProtectedDashboard role="tourist">
              <PaymentForm />
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

        <Route
          path="/tourist-dashboard/reviews/form"
          element={
            <ProtectedDashboard role="tourist">
              <ReviewForm />
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