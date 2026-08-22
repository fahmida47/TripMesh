import "./TouristStats.css";

export default function TouristStatCard({
  icon: Icon,
  tone = "blue",
  label,
  value,
  description,
  status,
}) {
  return (
    <article className="ts-stat-card">
      <div className={`ts-stat-icon ts-stat-icon--${tone}`}>
        <Icon aria-hidden="true" />
      </div>

      <div className="ts-stat-body">
        <p className="ts-stat-label">{label}</p>
        <p className="ts-stat-value">{value}</p>

        <div className="ts-stat-footer">
          {description && <span className="ts-stat-desc">{description}</span>}
          {status?.text && (
            <span
              className={`ts-stat-pill ts-stat-pill--${status.tone || "neutral"}`}
            >
              {status.text}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
