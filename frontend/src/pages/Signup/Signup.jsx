import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Signup.css";
import signupBg from "../../assets/login-bg.jpeg";
import Loading from "../../components/Loading/Loading";

const API_URL = "http://127.0.0.1:8000/api";

const LogoIcon = () => (
  <svg viewBox="0 0 80 80" className="trip-logo" fill="none">
    <defs>
      <linearGradient
        id="signupTripGradient"
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="33"
      stroke="url(#signupTripGradient)"
      strokeWidth="4"
    />

    <path
      d="
        M40 18
        C29 18 21 26 21 37
        C21 51 40 64 40 64
        C40 64 59 51 59 37
        C59 26 51 18 40 18Z
      "
      fill="url(#signupTripGradient)"
    />

    <circle cx="40" cy="37" r="9" fill="white" />
    <circle cx="40" cy="37" r="5" fill="#2563eb" />
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    role: "Tourist",
    name: "",
    phone: location.state?.phone || "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = data.name.trim();
    const phone = data.phone.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            name: name,
            phone: phone,
            role: data.role.toLowerCase(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Registration failed. Please try again."
        );

        setLoading(false);
        return;
      }

      // ==========================================
      // SAVE JWT TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        result.token
      );

      // ==========================================
      // SAVE USER
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // ==========================================
      // ROLE BASED DASHBOARD
      // ==========================================

      if (result.user.role === "guide") {
        navigate("/guide-dashboard");
      } else {
        navigate("/tourist-dashboard");
      }

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure Laravel is running."
      );

      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Loading
          text="Creating TripMesh Account"
          subText="Setting up your travel profile..."
        />
      )}

      <div className="signup-container">

        {/* ================================
            BACKGROUND
        ================================= */}

        <div
          className="signup-background"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,40,90,0.45),
                rgba(0,40,90,0.45)
              ),
              url(${signupBg})
            `,
          }}
        />

        {/* ================================
            LEFT SIDE
        ================================= */}

        <div className="signup-left">

          <div className="signup-brand">
            ✈ TripMesh
          </div>

          <div className="signup-hero-text">

            <h1>
              Explore more.
              <br />
              Travel better.
            </h1>

            <p>
              Join TripMesh and discover amazing places,
              <br />
              connect with trusted guides, and create
              <br />
              unforgettable travel experiences.
            </p>

          </div>

        </div>

        {/* ================================
            RIGHT SIDE
        ================================= */}

        <div className="signup-right">

          <div className="signup-card">

            <div className="signup-logo">
              <LogoIcon />
            </div>

            <h2>
              Create Account
            </h2>

            <p className="signup-subtitle">
              Join TripMesh today
            </p>

            <form onSubmit={handleSubmit}>

              {/* ROLE */}

              <p className="role-title">
                Choose your role
              </p>

              <div className="role-container">

                {/* TOURIST */}

                <label
                  className={`role-card ${
                    data.role === "Tourist"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="Tourist"
                    checked={
                      data.role === "Tourist"
                    }
                    onChange={handleChange}
                  />

                  <span className="role-icon">
                    🧳
                  </span>

                  <div>
                    <h4>
                      Tourist
                    </h4>

                    <small>
                      Explore & book trips
                    </small>
                  </div>

                </label>

                {/* GUIDE */}

                <label
                  className={`role-card ${
                    data.role === "Guide"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="Guide"
                    checked={
                      data.role === "Guide"
                    }
                    onChange={handleChange}
                  />

                  <span className="role-icon">
                    🗺️
                  </span>

                  <div>
                    <h4>
                      Guide
                    </h4>

                    <small>
                      Provide travel services
                    </small>
                  </div>

                </label>

              </div>

              {/* NAME */}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={data.name}
                onChange={handleChange}
                required
              />

              {/* PHONE */}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={data.phone}
                onChange={handleChange}
                required
              />

              {/* ERROR */}

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              {/* SIGN UP */}

              <button type="submit">
                Sign Up
              </button>

            </form>

            {/* FOOTER */}

            <p className="signup-footer">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>
    </>
  );
};

export default Signup;