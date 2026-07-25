import DashboardLayout from "./components/layout/DashboardLayout";
import TouristProfile from "./components/TouristProfile";
import { touristProfile } from "./mockProfile";

/**
 * This is the page you route to (e.g. /dashboard/profile).
 * It wraps the profile form in the same sidebar + topbar shell used
 * across the rest of the TripMesh dashboard, so it matches the
 * reference design instead of floating on a blank page.
 */
export default function ProfileSettingsPage() {
  return (
    <DashboardLayout activeKey="profile" profile={touristProfile}>
      <TouristProfile />
    </DashboardLayout>
  );
}
