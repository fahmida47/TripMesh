import UpcomingTrips from "./UpcomingTrips";
import RecentRequests from "./RecentRequests";
import RecentActivity from "./RecentActivity";
import NeedHelp from "./NeedHelp";
import "./DashboardOverview.css";

/**
 * Lays out the second half of the tourist dashboard exactly like the
 * reference design: Upcoming Trips + Recent Requests as two wide columns,
 * and a narrower right sidebar stacking Recent Activity and the
 * Need Help box.
 */
export default function DashboardOverview() {
  return (
    <section className="ts-overview" aria-label="Trips, requests and activity">
      <div className="ts-overview-main">
        <UpcomingTrips />
        <RecentRequests />
      </div>

      <div className="ts-overview-side">
        <RecentActivity />
        <NeedHelp />
      </div>
    </section>
  );
}
