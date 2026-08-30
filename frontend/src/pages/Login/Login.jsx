import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginBg from "../../assets/login-bg.jpeg";
import Loading from "../../components/Loading/Loading";

const API_URL = "http://127.0.0.1:8000/api";

const LogoIcon = () => (
  <svg viewBox="0 0 80 80" className="trip-logo" fill="none">
    <defs>
      <linearGradient id="tripGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="33"
      stroke="url(#tripGradient)"
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
      fill="url(#tripGradient)"
    />

    <circle cx="40" cy="37" r="9" fill="white" />
    <circle cx="40" cy="37" r="5" fill="#2563eb" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    verificationCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // SEND / RETRY VERIFICATION CODE
  const handleSendCode = async () => {
    setError("");
    setSuccess("");

    const phone = formData.phone.trim();

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSendingCode(true);

    try {
      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to send verification code.");
        setSendingCode(false);
        return;
      }

      setCodeSent(true);

      setFormData((prev) => ({
        ...prev,
        verificationCode: "",
      }));

      setSuccess("Verification code sent successfully.");
      setShowRetry(false);
      setSendingCode(false);
    } catch (err) {
      console.error("Send code error:", err);

      setError(
        "Unable to connect to the server. Please make sure Laravel is running."
      );

      setSendingCode(false);
    }
  };

  // VERIFY CODE + LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const phone = formData.phone.trim();
    const verificationCode = formData.verificationCode.trim();

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          code: verificationCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Invalid verification code.");

        // Retry only appears when OTP is wrong
        setShowRetry(true);

        setLoading(false);
        return;
      }

      // EXISTING USER
      if (result.is_new_user === false && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("isLoggedIn", "true");

        if (result.user.role === "guide") {
          navigate("/guide-dashboard");
        } else {
          navigate("/tourist-dashboard");
        }

        return;
      }

      // NEW USER
      if (result.is_new_user === true) {
        setLoading(false);

        navigate("/signup", {
          state: {
            phone: phone,
          },
        });

        return;
      }

      setError("Something went wrong.");
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err);

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
          text="Exploring TripMesh"
          subText="Connecting you with new adventures..."
        />
      )}

      <div className="auth-container">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="login-logo">
              <LogoIcon />
            </div>

            <h2>Welcome Back!</h2>

            <p className="subtitle">
              Login to continue your adventure
            </p>

            <form onSubmit={handleSubmit}>
              {/* PHONE */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              {/* SEND VERIFICATION CODE */}
              {!codeSent && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode}
                >
                  {sendingCode
                    ? "Sending..."
                    : "Send Verification Code"}
                </button>
              )}

              {/* SUCCESS MESSAGE */}
              {success && (
                <p className="login-success">
                  {success}
                </p>
              )}

              {/* OTP INPUT */}
              {codeSent && (
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Verification Code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              {/* RETRY - ONLY AFTER WRONG OTP */}
              {codeSent && showRetry && (
                <div className="retry-container">
                  <span>Didn't receive the code?</span>

                  <button
                    type="button"
                    className="retry-button"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                  >
                    {sendingCode ? "Sending..." : "Retry"}
                  </button>
                </div>
              )}

              {/* VERIFY & LOGIN */}
              {codeSent && (
                <button type="submit">
                  Verify & Login
                </button>
              )}
            </form>

            {/* FOOTER */}
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