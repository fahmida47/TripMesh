import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiAward,
  FiDollarSign,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import TouristStatCard from "./TouristStatCard";
import "./TouristStats.css";

// Mock data only — no backend, no API calls (per issue's acceptance criteria).
// Swap this for real data later by passing a `stats` prop with the same shape.
export const touristStats = [
  {
    id: 1,
    icon: FiFileText,
    tone: "blue",
    label: "Total Requests",
    value: 12,
    description: "All submitted requests",
  },
  {
    id: 2,
    icon: FiClock,
    tone: "orange",
    label: "Pending Requests",
    value: 3,
    description: "Awaiting company response",
    status: { text: "Awaiting", tone: "warning" },
  },
  {
    id: 3,
    icon: FiCheckCircle,
    tone: "green",
    label: "Accepted Requests",
    value: 6,
    description: "Approved by tour companies",
    status: { text: "Accepted", tone: "positive" },
  },
  {
    id: 4,
    icon: FiCalendar,
    tone: "blue",
    label: "Upcoming Bookings",
    value: 2,
    description: "Confirmed upcoming tours",
    status: { text: "Confirmed", tone: "positive" },
  },
  {
    id: 5,
    icon: FiAward,
    tone: "green",
    label: "Completed Tours",
    value: 5,
    description: "Trips completed so far",
  },
  {
    id: 6,
    icon: FiDollarSign,
    tone: "purple",
    label: "Total Spent",
    value: `৳${new Intl.NumberFormat("en-BD").format(28650)}`,
    description: "Total payments in BDT",
    status: { text: "This year", tone: "info" },
  },
  {
    id: 7,
    icon: FiHeart,
    tone: "orange",
    label: "Favorite Companies",
    value: 8,
    description: "Saved guide companies",
  },
  {
    id: 8,
    icon: FiStar,
    tone: "purple",
    label: "Submitted Reviews",
    value: 4,
    description: "Reviews you've shared",
    status: { text: "Share more", tone: "neutral" },
  },
];

export default function TouristStats({ stats = touristStats }) {
  return (
    <section className="ts-stats" aria-label="Dashboard overview">
      {stats.map((stat) => (
        <TouristStatCard key={stat.id} {...stat} />
      ))}
    </section>
  );
}
