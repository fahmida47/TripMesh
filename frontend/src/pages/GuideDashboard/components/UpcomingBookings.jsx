const bookings = [
  ["28", "Cox's Bazar Beach & Hill Tour", "Group Tour · 6 People", "BDT 12,000"],
  ["29", "Sundarbans Wildlife Adventure", "Group Tour · 4 People", "BDT 16,500"],
  ["30", "Dhaka City Heritage Walk", "Dual Tour · 2 People", "BDT 4,500"],
];

const UpcomingBookings = () => {
  return (
    <article className="overview-card bookings-card">
      <div className="overview-card__heading">
        <h2>Upcoming Bookings</h2>
        <a href="#bookings">View All</a>
      </div>

      <div className="booking-list">
        {bookings.map(([day, tour, kind, price]) => (
          <div className="booking-row" key={day}>
            <time>
              <b>{day}</b>
              <span>JUL</span>
            </time>

            <div>
              <b>{tour}</b>
              <span>{kind}</span>
            </div>

            <div>
              <strong>{price}</strong>
              <em className="status-badge status-badge--accepted">
                Confirmed
              </em>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default UpcomingBookings;