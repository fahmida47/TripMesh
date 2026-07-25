import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import coxsBazarImg from "../../../assets/coxsbazar.jpg";
import sundarbansImg from "../../../assets/sundarbans.jpg";
import "./UpcomingTrips.css";

// Mock data only — no API calls.
const upcomingTrips = [
  {
    id: 1,
    title: "Cox's Bazar Beach & Hill Tour",
    image: coxsBazarImg,
    location: "Cox's Bazar",
    date: "12 Jun 2025",
    people: 6,
    price: 12000,
    type: "Group Tour",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Sundarbans Wildlife Adventure",
    image: sundarbansImg,
    location: "Sundarbans",
    date: "25 Jun 2025",
    people: 4,
    price: 16500,
    type: "Dual Tour",
    status: "Confirmed",
  },
];

export default function UpcomingTrips() {
  return (
    <section className="ts-panel ts-trips" aria-label="Upcoming trips">
      <div className="ts-panel-header">
        <h2>Upcoming Trips</h2>
        <a href="#trips">View All</a>
      </div>

      <div className="ts-trips-list">
        {upcomingTrips.map((trip) => (
          <article key={trip.id} className="ts-trip-row">
            <img src={trip.image} alt={trip.title} className="ts-trip-img" />

            <div className="ts-trip-info">
              <h3>{trip.title}</h3>
              <div className="ts-trip-meta">
                <span>
                  <FiMapPin aria-hidden="true" /> {trip.location}
                </span>
                <span>
                  <FiCalendar aria-hidden="true" /> {trip.date}
                </span>
                <span>
                  <FiUsers aria-hidden="true" /> {trip.people} People
                </span>
              </div>
              <span className="ts-trip-type">{trip.type}</span>
            </div>

            <div className="ts-trip-side">
              <p className="ts-trip-price">
                ৳{new Intl.NumberFormat("en-BD").format(trip.price)}
              </p>
              <span className="ts-badge ts-badge--positive">{trip.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
