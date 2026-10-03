import Explore from "../Explore/Explore";

import "./TouristDashboard.css";

// Dashboard home. The sidebar navigates between routes (bookings, payments,
// reviews, profile), so this page only renders the shell around Explore.
export default function TouristDashboard() {
  return <Explore embedded />;
}
