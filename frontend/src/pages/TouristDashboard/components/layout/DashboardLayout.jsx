import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./DashboardLayout.css";

/**
 * Reusable page shell matching the TripMesh dashboard reference design:
 * navy sidebar on the left, navy topbar across the top, light content
 * area on the right. Any dashboard page's content goes in `children`.
 */
export default function DashboardLayout({ activeKey, profile, children }) {
  return (
    <div className="ts-shell">
      <Topbar profile={profile} />
      <div className="ts-shell-body">
        <Sidebar activeKey={activeKey} />
        <main className="ts-shell-content">{children}</main>
      </div>
    </div>
  );
}
