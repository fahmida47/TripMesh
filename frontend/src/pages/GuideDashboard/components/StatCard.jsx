import { FiArrowDownRight, FiArrowUpRight, FiStar } from "react-icons/fi";

const StatCard = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  tone,
  format,
}) => {
  const isUpward = trend === "up";
  const TrendIcon = isUpward ? FiArrowUpRight : FiArrowDownRight;
  const formattedValue =
    format === "currency"
      ? `৳ ${new Intl.NumberFormat("en-BD").format(value)}`
      : value;

  const changeText =
    format === "rating" ? `${change} from last month` : `${change}% from last month`;

  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${tone}`}>
        <Icon aria-hidden="true" />
      </div>

      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">
          {formattedValue}
          {format === "rating" && <FiStar className="stat-card__star" aria-label="star" />}
        </p>
        <p className={`stat-card__change stat-card__change--${trend}`}>
          <TrendIcon aria-hidden="true" />
          {changeText}
        </p>
      </div>
    </article>
  );
};

export default StatCard;
