import {
  Routes,
  Route,
  Link,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import { getLoggedInUser } from "./utils/auth";

import GlobalLandingPage from "./pages/GlobalLandingPage/GlobalLandingPage";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AboutUs from "./pages/AboutUs/AboutUs";
import Contact from "./pages/Contact/Contact";

/* GUIDE DASHBOARD */
import GuideLayout from "./pages/GuideDashboard/GuideLayout";
import GuideDashboard from "./pages/GuideDashboard/GuideDashboard";
import GuideProfile from "./pages/GuideDashboard/Profile/GuideProfile";
import GuideTourServices from "./pages/GuideDashboard/TourServices/GuideTourServices";
import AddTourService from "./pages/GuideDashboard/TourServices/AddTourService";
import GuideRequests from "./pages/GuideDashboard/GuideRequest/GuideRequests";
import GuideBookings from "./pages/GuideDashboard/Bookings/GuideBookings";
import GuidePayouts from "./pages/GuideDashboard/Payouts/GuidePayouts";
import ReviewsRatings from "./pages/GuideDashboard/Rating/ReviewsRatings";

/* TOURIST DASHBOARD */
import TouristDashboard from "./pages/TouristDashboard/TouristDashboard";
import TouristLayout from "./pages/TouristDashboard/TouristLayout";
import TouristProfile from "./pages/TouristDashboard/Profile/TouristProfile";
import TouristReviews from "./pages/TouristDashboard/Reviews/TouristReviews";
import RequestsBookings from "./pages/TouristDashboard/components/RequestsBookings";
import PaymentHistory from "./pages/TouristDashboard/components/PaymentHistory";
import PaymentPage from "./pages/TouristDashboard/components/PaymentPage";


/* CHAT */
import ChatBox from "./pages/Chat/ChatBox";

/* ADMIN */
import ReviewForm from "./pages/TouristDashboard/Reviews/ReviewForm";

/* =========================
   ADMIN
========================= */



import AdminDashboard, {
  AdminGuard,
  AdminOverview,
  AdminList,
  AdminPayments,
  AdminCommissions,
  AdminReviews,
  AdminProfile,
} from "./pages/Admin/AdminDashboard";

const ROLE_HOME = {
  guide: "/guide-dashboard",
  tourist: "/tourist-dashboard",
  admin: "/admin/dashboard",
};

function PublicOnly({ children }) {
  const user = getLoggedInUser();

  if (user && ROLE_HOME[user.role]) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return children;
}

function LoginRedirect() {
  const user = getLoggedInUser();

  if (!user) {
    return <Login />;
  }

  return (
    <Navigate
      to={ROLE_HOME[user.role] || "/"}
      replace
    />
  );
}

function SignupRedirect() {
  const user = getLoggedInUser();

  if (!user) {
    return <Signup />;
  }

  return (
    <Navigate
      to={ROLE_HOME[user.role] || "/"}
      replace
    />
  );
}

function ProtectedDashboard({ children, role }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === role) {
    return children;

  }
  if (user.role !== role) {
    if (user.role === "guide") {
      return <Navigate to="/guide-dashboard" replace />;
    }

    if (user.role === "tourist") {
      return <Navigate to="/tourist-dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }


  }

  return (
    <Navigate
      to={ROLE_HOME[user.role] || "/login"}
      replace
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* PUBLIC */}
        <Route

          path="/"
          element={
            <PublicOnly>
              <GlobalLandingPage />
            </PublicOnly>
          }
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
          element={<LoginRedirect />}
        />

        <Route
          path="/signup"
          element={<SignupRedirect />}
        />

        {/* ADMIN */}
        <Route

          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminOverview />}
          />

          <Route
            path="payments"
            element={<AdminPayments />}
          />

          <Route
            path="commissions"
            element={<AdminCommissions />}
          />

          <Route
            path="bookings"
            element={
              <AdminList kind="bookings" />
            }
          />

          <Route
            path="guides"
            element={
              <AdminList kind="guides" />
            }
          />

          <Route
            path="tourists"
            element={
              <AdminList kind="tourists" />
            }
          />

          <Route
            path="reviews"
            element={<AdminReviews />}
          />

          <Route
            path="chat"
            element={
              <ChatBox userType="admin" />
            }
          />

          <Route
            path="profile"
            element={<AdminProfile />}
          />
        </Route>

        {/* GUIDE DASHBOARD */}
        <Route
          path="/guide-dashboard"
          element={
            <ProtectedDashboard role="guide">
              <GuideLayout />
            </ProtectedDashboard>
          }
        >
          <Route
            index
            element={<GuideDashboard />}
          />

          <Route
            path="profile"
            element={<GuideProfile />}
          />

          <Route
            path="tour-services"
            element={<GuideTourServices />}
          />

          <Route
            path="tour-services/add"
            element={<AddTourService />}
          />

          <Route path="tour-services/edit/:id" element={<AddTourService />} />

          <Route
            path="requests"
            element={<GuideRequests />}
          />

          <Route
            path="bookings"
            element={<GuideBookings />}
          />

          <Route
            path="payouts"
            element={<GuidePayouts />}
          />

          <Route
            path="reviews"
            element={<ReviewsRatings />}
          />

          <Route
            path="chat"
            element={
              <ChatBox userType="guide" />
            }
          />
        </Route>

        {/* TOURIST DASHBOARD */}
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

        {/* TOURIST CHAT */}
        <Route
          path="/tourist-dashboard/chat"
          element={
            <ProtectedDashboard role="tourist">
              <TouristLayout />
            </ProtectedDashboard>
          }
        >
          <Route
            index
            element={
              <ChatBox userType="tourist" />
            }
          />
        </Route>

        {/* NOT FOUND */}
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
