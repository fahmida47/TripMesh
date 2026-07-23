const team = [
  { name: "Fahmida Afrin Nadia ", role: "Founder & CEO", initials: "FAN", color: "#2e7dfb" },
  { name: "Ahona Zabin Tasrif", role: "COO", initials: "AZT", color: "#c2489a" },
  { name: "Afifa Faija", role: "CTO", initials: "AF", color: "#1cadb5" },
  { name: "Afra Anan Ramisa", role: "Head of Operations", initials: "AAR", color: "#f2994a" },
];

function Team() {
  return (
    <div className="tm-team-col">
      <p className="tm-eyebrow tm-eyebrow-light">MEET THE TEAM</p>
      <h2>Passionate Travelers &amp; Tech Enthusiasts</h2>
      <p className="tm-team-text">
        We're a team of travelers, explorers, and technologists working
        together to make travel more authentic, connected, and accessible
        for everyone.
      </p>

      <div className="tm-team-grid">
        {team.map((member) => (
          <div className="tm-team-member" key={member.name}>
            <span
              className="tm-team-avatar"
              style={{ background: member.color }}
            >
              {member.initials}
            </span>
            <h4>{member.name}</h4>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
