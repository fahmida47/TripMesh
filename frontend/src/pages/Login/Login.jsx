import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginBg from "../../assets/login-bg.jpeg";
import Loading from "../../components/Loading/Loading";

const LogoIcon = () => (
  <svg viewBox="0 0 80 80" className="trip-logo" fill="none">
    <defs>
      <linearGradient id="tripGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />

        <stop offset="50%" stopColor="#2563eb" />

        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>

    {/* Outer Circle */}

    <circle
      cx="40"
      cy="40"
      r="33"
      stroke="url(#tripGradient)"
      strokeWidth="4"
    />

    {/* Location Pin */}

    <path
      d="
      M40 18
      C29 18 21 26 21 37
      C21 51 40 64 40 64
      C40 64 59 51 59 37
      C59 26 51 18 40 18Z
      "
      fill="url(#tripGradient)"
    />

    {/* Center Circle */}

    <circle cx="40" cy="37" r="9" fill="white" />

    <circle cx="40" cy="37" r="5" fill="#2563eb" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setLoading(true);
      setTimeout(() => {
        // after login go landing page
        navigate("/");
      }, 1000);
    }
  };

  return (
    <>
      {loading && (
        <Loading
          text="Exploring TripMesh"
          subText="Connecting you with new adventures..."
        />
      )}
      <div className="auth-container">
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

        <div className="auth-right">
          <div className="auth-card">
            <div className="login-logo">
              <LogoIcon />
            </div>
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
                required
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
                required
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
    </>
  );
};

export default Login;
