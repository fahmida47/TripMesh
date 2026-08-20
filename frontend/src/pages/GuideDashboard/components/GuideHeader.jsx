import "./GuideHeader.css";

const GuideHeader = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const guideName = user.name || "Guide";

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

    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  const formattedDate = registeredDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="guide-header">
      <div className="guide-header-text">
        <h2>Welcome back, {guideName}! 👋</h2>

        <p>{formattedDate}</p>
      </div>
    </header>
  );
};

export default GuideHeader;
