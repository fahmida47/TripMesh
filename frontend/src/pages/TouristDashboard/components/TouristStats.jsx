import TouristStatCard from "./TouristStatCard";
import { touristStats } from "./TouristStatsData";
import "./TouristStats.css";

export default function TouristStats({ stats = touristStats }) {
  return (
    <section className="ts-stats" aria-label="Dashboard overview">
      {stats.map((stat) => (
        <TouristStatCard key={stat.id} {...stat} />
      ))}
    </section>
  );
}