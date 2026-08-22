import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";
import StatCard from "./StatCard";
import "./DashboardStats.css";

const dashboardStats = [
  {
    id: 1,
    label: "Total Requests",
    value: 32,
    change: 12,
    trend: "up",
    icon: FiMessageSquare,
    tone: "blue",
  },
  {
    id: 2,
    label: "Pending Requests",
    value: 8,
    change: 5,
    trend: "up",
    icon: FiClock,
    tone: "orange",
  },
  {
    id: 3,
    label: "Accepted Requests",
    value: 16,
    change: 8,
    trend: "up",
    icon: FiCheckCircle,
    tone: "green",
  },
  {
    id: 4,
    label: "Completed Tours",
    value: 24,
    change: 15,
    trend: "up",
    icon: FiCalendar,
    tone: "purple",
  },
  {
    id: 5,
    label: "Total Earnings",
    value: 78450,
    change: 18,
    trend: "up",
    icon: FiDollarSign,
    tone: "teal",
    format: "currency",
  },
  {
    id: 6,
    label: "Average Rating",
    value: 4.8,
    change: 0.2,
    trend: "up",
    icon: FiStar,
    tone: "yellow",
    format: "rating",
  },
];

const DashboardStats = () => (
  <section className="dashboard-stats" aria-label="Dashboard summary">
    {dashboardStats.map((stat) => (
      <StatCard key={stat.id} {...stat} />
    ))}
  </section>
);

export default DashboardStats;
