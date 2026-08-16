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
    phone: "",
    verificationCode: "",
  });

  const [error, setError] = useState("");

  /*
    ==========================================
    MANUAL VERIFICATION CODE
    ==========================================

    Sir je verification code diyechen,
    ekhane oi code boshao.

    Example:
    123456
  */

  const VERIFICATION_CODE = "123456";

  /* ===============================
          INPUT CHANGE
  ================================ */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  /* ===============================
          LOGIN
  ================================ */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const phone = formData.phone.trim();
    const verificationCode =
      formData.verificationCode.trim();

    /* ===============================
          PHONE VALIDATION
    ================================ */

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    /* ===============================
          VERIFICATION CODE
    ================================ */

    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    if (verificationCode !== VERIFICATION_CODE) {
      setError("Invalid verification code.");
      return;
    }

    /* ===============================
          CHECK USER
    ================================ */

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    /*
      ==========================================
      NEW USER
      ==========================================

      Phone number localStorage-er user-er
      sathe match na korle Signup-e jabe.
    */

    if (!savedUser || savedUser.phone !== phone) {
      navigate("/signup", {
        state: {
          phone: phone,
        },
      });

      return;
    }

    /* ===============================
          OLD USER
    ================================ */

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    setLoading(true);

    /* ===============================
          ROLE BASED NAVIGATION
    ================================ */

    setTimeout(() => {
      if (savedUser.role === "Guide") {
        navigate("/guide-dashboard");
      } else {
        navigate("/tourist-dashboard");
      }
    }, 1000);
  };

  return (
    <>
      {/* ===============================
            LOADING
      ================================ */}

      {loading && (
        <Loading
          text="Exploring TripMesh"
          subText="Connecting you with new adventures..."
        />
      )}

      <div className="auth-container">

        {/* ===============================
              LEFT SIDE
        ================================ */}

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

          {/* Brand */}

          <div className="logo">
            ✈ TripMesh
          </div>

          {/* Hero Text */}

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

        {/* ===============================
              RIGHT SIDE
        ================================ */}

        <div className="auth-right">

          <div className="auth-card">

            {/* Logo Icon */}

            <div className="login-logo">
              <LogoIcon />
            </div>

            {/* Heading */}

            <h2>
              Welcome Back!
            </h2>

            <p className="subtitle">
              Login to continue your adventure
            </p>

            {/* ===============================
                  LOGIN FORM
            ================================ */}

            <form onSubmit={handleSubmit}>

              {/* Phone Number */}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              {/* Verification Code */}

              <input
                type="text"
                name="verificationCode"
                placeholder="Verification Code"
                value={formData.verificationCode}
                onChange={handleChange}
                maxLength={6}
                required
              />

              {/* Error */}

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              

              {/* Login Button */}

              <button type="submit">
                Verify & Login
              </button>

            </form>

            {/* ===============================
                  FOOTER
            ================================ */}

            <p className="footer-text">
              Don't have an account?

              <Link to="/signup">
                Sign Up
              </Link>
            </p>

          </div>

        </div>

      </div>
    </>
  );
};

export default Login;