import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import sylhetImg from "../../../assets/sylhet-tea-garden.png";
import paharpurImg from "../../../assets/paharpur.jpg";
import dhakaImg from "../../../assets/dhaka-city.jpg";
import "./RecentRequests.css";

// Mock data only — no API calls.
const recentRequests = [
  {
    id: 1,
    title: "Sylhet Tea Garden Tour",
    image: sylhetImg,
    location: "Sylhet",
    date: "20 Jun 2025",
    people: 2,
    type: "Single Tour",
    status: "Pending",
  },
  {
    id: 2,
    title: "Paharpur Heritage Tour",
    image: paharpurImg,
    location: "Paharpur",
    date: "18 Jun 2025",
    people: 4,
    type: "Group Tour",
    status: "Pending",
  },
  {
    id: 3,
    title: "Dhaka City Heritage Walk",
    image: dhakaImg,
    location: "Dhaka",
    date: "15 Jun 2025",
    people: 2,
    type: "Dual Tour",
    status: "Accepted",
  },
];

const STATUS_TONE = {
  Pending: "warning",
  Accepted: "positive",
  Rejected: "danger",
};

export default function RecentRequests() {
  return (
    <section className="ts-panel ts-requests" aria-label="Recent requests">
      <div className="ts-panel-header">
        <h2>Recent Requests</h2>
        <a href="#requests">View All</a>
      </div>

      <div className="ts-requests-list">
        {recentRequests.map((req) => (
          <article key={req.id} className="ts-request-row">
            <img src={req.image} alt={req.title} className="ts-request-img" />

            <div className="ts-request-info">
              <div className="ts-request-title-row">
                <h3>{req.title}</h3>
                <span className={`ts-badge ts-badge--${STATUS_TONE[req.status] || "neutral"}`}>
                  {req.status}
                </span>
              </div>
              <div className="ts-request-meta">
                <span>
                  <FiMapPin aria-hidden="true" /> {req.location}
                </span>
                <span>
                  <FiCalendar aria-hidden="true" /> {req.date}
                </span>
                <span>
                  <FiUsers aria-hidden="true" /> {req.people} People
                </span>
              </div>
              <span className="ts-trip-type">{req.type}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
