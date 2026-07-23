import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import signupBg from "../../assets/login-bg.jpeg";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Tourist",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <div className="signup-container">
      <div className="signup-left"
        style={{
          backgroundImage: `
          linear-gradient(
          rgba(0,40,90,0.45),
          rgba(0,40,90,0.45)
          ),
          url(${signupBg})
          `,
        }}
      >
        <div className="logo">✈ TripMesh</div>

        <div className="signup-hero">
          <h1>
            Start your journey.
            <br />
            Explore the world.
          </h1>

          <p>
            Join TripMesh and discover amazing destinations with trusted
            travelers and guides.
          </p>
        </div>

        
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <h2>Create Account</h2>

          <p className="subtitle">Join TripMesh today</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={data.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={data.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
            />

            <p className="choose">Choose your role</p>

            <div className="role-selection">
              <label
                className={
                  data.role === "Tourist" ? "role-card active" : "role-card"
                }
              >
                <input
                  type="radio"
                  name="role"
                  value="Tourist"
                  checked={data.role === "Tourist"}
                  onChange={handleChange}
                />

                <span className="icon">🧳</span>

                <div>
                  <h4>Tourist</h4>
                  <small>Explore places & book trips</small>
                </div>
              </label>

              <label
                className={
                  data.role === "Guide" ? "role-card active" : "role-card"
                }
              >
                <input
                  type="radio"
                  name="role"
                  value="Guide"
                  checked={data.role === "Guide"}
                  onChange={handleChange}
                />

                <span className="icon">🗺️</span>

                <div>
                  <h4>Guide</h4>
                  <small>Provide travel services</small>
                </div>
              </label>
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p className="footer-text">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
