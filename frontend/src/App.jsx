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

import TouristDashboard from "./pages/TouristDashboard/TouristDashboard";
import TouristProfile from "./pages/TouristDashboard/Profile/TouristProfile";
import TouristReviews from "./pages/TouristDashboard/Reviews/TouristReviews";
import RequestsBookings from "./pages/TouristDashboard/components/RequestsBookings";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={<GlobalLandingPage />}
        />

        {/* EXPLORE */}
        <Route
          path="/explore"
          element={<Explore />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<AboutUs />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ======================
            GUIDE DASHBOARD
        ====================== */}

        <Route
          path="/guide-dashboard"
          element={<GuideDashboard />}
        />

        <Route
          path="/guide-dashboard/profile"
          element={<GuideProfile />}
        />

        <Route
          path="/guide-dashboard/tour-services"
          element={<GuideTourServices />}
        />

        <Route
          path="/guide-dashboard/tour-services/add"
          element={<AddTourService />}
        />

        <Route
          path="/guide-dashboard/requests"
          element={<GuideRequests />}
        />

        <Route
          path="/guide-dashboard/bookings"
          element={<GuideBookings />}
        />

        {/* ======================
            TOURIST DASHBOARD
        ====================== */}

        <Route
          path="/tourist-dashboard"
          element={<TouristDashboard />}
        />

        {/* TOURIST PROFILE */}
        <Route
          path="/tourist-dashboard/profile"
          element={<TouristProfile />}
        />

        {/* TOURIST BOOKINGS */}
        <Route
          path="/tourist-dashboard/bookings"
          element={<RequestsBookings />}
        />

        {/* TOURIST REVIEWS */}
        <Route
          path="/tourist-dashboard/reviews"
          element={<TouristReviews />}
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