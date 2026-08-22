import { FiCheck, FiSend, FiStar } from "react-icons/fi";
import "./RecentActivity.css";

// Mock data only — no API calls.
const activity = [
  {
    id: 1,
    icon: FiCheck,
    tone: "green",
    title: "Payment Successful",
    subtitle: "Cox's Bazar Tour",
    amount: "৳12,000",
    date: "May 28, 2025",
  },
  {
    id: 2,
    icon: FiSend,
    tone: "orange",
    title: "Request Sent",
    subtitle: "Sylhet Tea Garden Tour",
    date: "May 25, 2025",
  },
  {
    id: 3,
    icon: FiCheck,
    tone: "green",
    title: "Tour Completed",
    subtitle: "Sajek Valley Tour",
    rating: "5.0",
    date: "May 10, 2025",
  },
  {
    id: 4,
    icon: FiStar,
    tone: "purple",
    title: "Review Submitted",
    subtitle: "Sundarbans Tour",
    date: "May 5, 2025",
  },
];

export default function RecentActivity() {
  return (
    <section className="ts-panel ts-activity" aria-label="Recent activity">
      <div className="ts-panel-header">
        <h2>Recent Activity</h2>
        <a href="#activity">View All</a>
      </div>

      <ul className="ts-activity-list">
        {activity.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="ts-activity-row">
              <span
                className={`ts-activity-icon ts-activity-icon--${item.tone}`}
              >
                <Icon aria-hidden="true" />
              </span>

              <div className="ts-activity-info">
                <p className="ts-activity-title">{item.title}</p>
                <p className="ts-activity-subtitle">{item.subtitle}</p>
                <p className="ts-activity-date">{item.date}</p>
              </div>

              {item.amount && (
                <span className="ts-activity-amount">{item.amount}</span>
              )}
              {item.rating && (
                <span className="ts-activity-rating">
                  <FiStar aria-hidden="true" /> {item.rating}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
