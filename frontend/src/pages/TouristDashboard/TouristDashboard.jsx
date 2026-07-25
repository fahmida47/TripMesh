import DashboardLayout from "./components/layout/DashboardLayout";
import TouristStats from "./components/TouristStats";
import DashboardOverview from "./components/DashboardOverview";
import { touristProfile } from "./mockProfile";

/**
 * Route this at /dashboard (or wherever your tourist lands after login).
 * Uses the same Sidebar + Topbar shell as ProfileSettingsPage so both
 * pages look like one connected app instead of two different UIs.
 */
export default function TouristDashboard() {
  return (
    <DashboardLayout activeKey="dashboard" profile={touristProfile}>
      <div className="ts-dashboard-header">
        <h1>Welcome back, {touristProfile.fullName.split(" ")[0]}! 👋</h1>
        <p>Plan your next adventure with TripMesh</p>
      </div>

      <TouristStats />

      <DashboardOverview />
    </DashboardLayout>
  );
}
