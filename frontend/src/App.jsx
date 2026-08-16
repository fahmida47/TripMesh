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

        <Route
          path="/guide-dashboard"
          element={<GuideDashboard />}
        />

        <Route
          path="/tourist-dashboard"
          element={<TouristDashboard />}
        />

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