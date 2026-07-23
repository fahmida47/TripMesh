import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginBg from "../../assets/login-bg.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    navigate("/");
  };

  return (
    <div className="auth-container">
      {/* Left Section */}
      <div
        className="auth-left"
        style={{
          backgroundImage: `
          linear-gradient(
          rgba(0,40,90,0.45),
          rgba(0,40,90,0.45)
          ),
          url(${loginBg})
          `,
        }}
      >
        <div className="logo">✈ TripMesh</div>
        <div className="hero-text">
          <h1>
            Explore more.
            <br />
            Travel better.
          </h1>

          <p>
            Connect with trusted guide services
            <br />
            and make your journey unforgettable.
          </p>
        </div>

        
      </div>

      {/* Right Section */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back!</h2>

          <p className="subtitle">Login to continue your adventure</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className="footer-text">
            Don't have an account?
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
