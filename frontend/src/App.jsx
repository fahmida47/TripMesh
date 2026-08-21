import {
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

import ScrollToTop from "./ScrollToTop";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AboutUs from "./pages/AboutUs/AboutUs";
import Contact from "./pages/Contact/Contact";

import GuideDashboard from "./pages/GuideDashboard/GuideDashboard";
import GuideProfile from "./pages/GuideDashboard/Profile/GuideProfile";

import GuideTourServices from "./pages/GuideDashboard/TourServices/GuideTourServices";
import AddTourService from "./pages/GuideDashboard/TourServices/AddTourService";

import GuideRequests from "./pages/GuideDashboard/GuideRequest/GuideRequests";
import GuideBookings from "./pages/GuideDashboard/Bookings/GuideBookings";

import ReviewsRatings from "./pages/GuideDashboard/Rating/ReviewsRatings";

import TouristDashboard from "./pages/TouristDashboard/TouristDashboard";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<GlobalLandingPage />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/about"
          element={<AboutUs />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* GUIDE DASHBOARD */}
        <Route
          path="/guide-dashboard"
          element={<GuideDashboard />}
        />

        {/* GUIDE PROFILE */}
        <Route
          path="/guide-dashboard/profile"
          element={<GuideProfile />}
        />

        {/* TOUR SERVICES */}
        <Route
          path="/guide-dashboard/tour-services"
          element={<GuideTourServices />}
        />

        <Route
          path="/guide-dashboard/tour-services/add"
          element={<AddTourService />}
        />

        {/* GUIDE REQUESTS */}
        <Route
          path="/guide-dashboard/requests"
          element={<GuideRequests />}
        />

        {/* GUIDE BOOKINGS */}
        <Route
          path="/guide-dashboard/bookings"
          element={<GuideBookings />}
        />

        {/* REVIEWS & RATINGS */}
        <Route
          path="/guide-dashboard/reviews"
          element={<ReviewsRatings />}
        />

        {/* TOURIST DASHBOARD */}
        <Route
          path="/tourist-dashboard"
          element={<TouristDashboard />}
        />

        {/* PAGE NOT FOUND */}
        <Route
          path="*"
          element={
            <div>
              <h2>Page Not Found</h2>

              <Link to="/">
                Go to Home
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;