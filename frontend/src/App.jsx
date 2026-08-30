import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route path="/" element={<GlobalLandingPage />} />

        <Route path="/explore" element={<Explore />} />

        <Route path="/about" element={<AboutUs />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* =========================
            GUIDE DASHBOARD
        ========================= */}

        <Route path="/guide-dashboard" element={<GuideLayout />}>
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
          element={<TouristDashboard />}
        />

        <Route
          path="/tourist-dashboard/profile"
          element={<TouristProfile />}
        />

        <Route
          path="/tourist-dashboard/bookings"
          element={<RequestsBookings />}
        />

        <Route
          path="/tourist-dashboard/payments"
          element={<PaymentHistory />}
        />

        <Route
          path="/tourist-dashboard/payments/form"
          element={<PaymentForm />}
        />

        <Route
          path="/tourist-dashboard/payment"
          element={<PaymentPage />}
        />

        <Route
          path="/tourist-dashboard/reviews"
          element={<TouristReviews />}
        />

        <Route
          path="/tourist-dashboard/reviews/form"
          element={<ReviewForm />}
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