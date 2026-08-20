import "./TouristTopbar.css";

const TouristTopbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const touristName = user.name || "Tourist";

  // Registration date
  let registeredDate;

  if (user.registeredDate) {
    registeredDate = new Date(user.registeredDate);
  } else {
    // Old account হলে আজকের date একবার save করে দিচ্ছি
    registeredDate = new Date();

    const updatedUser = {
      ...user,
      registeredDate: registeredDate.toISOString(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  }

  const formattedDate = registeredDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <header className="tourist-header">
      <div className="tourist-header-text">

        <h2>
          Welcome back, {touristName}! 👋
        </h2>

        <p>{formattedDate}</p>

      </div>
    </header>
  );
};

export default TouristTopbar;