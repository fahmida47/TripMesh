const ratingBars = [
  ["5 Stars", 96],
  ["4 Stars", 20],
  ["3 Stars", 6],
  ["2 Stars", 2],
  ["1 Star", 0],
];

const ReviewsSection = () => {
  return (
    <article className="overview-card reviews-card">
      <div className="overview-card__heading">
        <h2>Reviews & Ratings</h2>
        <a href="#reviews">View All</a>
      </div>

      <div className="ratings-summary">
        <div>
          <strong>4.8</strong>
          <span className="stars">★★★★★</span>
          <p>(124 Reviews)</p>
        </div>

        <div className="rating-bars">
          {ratingBars.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>

              <i>
                <b style={{ width: `${value}%` }} />
              </i>

              <small>{value}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="review">
        <span className="avatar">JS</span>

        <div>
          <b>John Smith</b>
          <span className="stars">★★★★★</span>

          <p>
            Excellent service! Our guide was very friendly and knowledgeable.
            We had an amazing time.
          </p>
        </div>

        <time>24 July 2026</time>
      </div>
    </article>
  );
};

export default ReviewsSection;