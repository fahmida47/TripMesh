import RecentRequests from "./RecentRequests";
import UpcomingBookings from "./UpcomingBookings";
import TopTourServices from "./TopTourServices";
import ReviewsSection from "./ReviewsSection";
import { FiShield } from "react-icons/fi";
import "./DashboardOverview.css";

const DashboardOverview = () => (
  <section className="dashboard-overview" aria-label="Dashboard overview">

    <div className="overview-grid overview-grid--top">
      <RecentRequests />
      <ReviewsSection />
    </div>

    <div className="overview-grid overview-grid--bottom">
      <UpcomingBookings />
      <TopTourServices />
    </div>

    <aside className="profile-banner">
      <FiShield aria-hidden="true" />

      <div>
        <h3>Complete Your Profile</h3>
        <p>
          Add more details to your profile and services to get more bookings.
        </p>
      </div>

      <button type="button">
        Update Profile
      </button>
    </aside>

  </section>
);

export default DashboardOverview;