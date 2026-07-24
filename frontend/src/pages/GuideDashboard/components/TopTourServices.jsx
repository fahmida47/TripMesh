import coxsBazarImage from "../../../assets/coxsbazar.jpg";
import sundarbansImage from "../../../assets/sundarbans.jpg";
import sylhetTeaGardenImage from "../../../assets/sylhet-tea-garden.png";

const tours = [
  ["Cox's Bazar Explorer", "Group Tour", "BDT 2,500", "48", coxsBazarImage],
  ["Sylhet Tea Garden Tour", "Dual Tour", "BDT 2,200", "32", sylhetTeaGardenImage],
  ["Sundarbans Wildlife Tour", "Group Tour", "BDT 3,500", "28", sundarbansImage],
];

const TopTourServices = () => {
  return (
    <article className="overview-card tours-card">
      <div className="overview-card__heading">
        <h2>Your Top Tour Services</h2>
        <a href="#services">Manage All</a>
      </div>

      <div className="tour-list">
        {tours.map(([name, type, price, count, image]) => (
          <div className="tour-row" key={name}>
            <img className="tour-image" src={image} alt={name} />

            <div>
              <b>{name}</b>
              <span>{type}</span>
            </div>

            <small>
              <b>{price}</b>
              <br />
              Price
            </small>

            <small>
              <b>{count}</b>
              <br />
              Bookings
            </small>
          </div>
        ))}
      </div>
    </article>
  );
};

export default TopTourServices;
