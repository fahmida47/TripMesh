import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not send the verification code.");
      setCodeSent(true);
      setMessage(result.message || "Verification code sent.");
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Invalid or expired verification code.");
      if (!result.token || result.user?.role !== "admin") {
        throw new Error("The server did not return a valid admin session.");
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={codeSent ? verifyCode : sendCode}>
        <span className="admin-brand">TripMesh <small>ADMIN</small></span>
        <h1>Admin sign in</h1>
        <p>Sign in with the phone number linked to your admin account.</p>
        <label htmlFor="admin-phone">Phone number</label>
        <input
          id="admin-phone"
          type="tel"
          autoComplete="tel"
          required
          minLength={10}
          maxLength={20}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={codeSent || busy}
        />
        {codeSent && (
          <>
            <label htmlFor="admin-code">Verification code</label>
            <input
              id="admin-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={6}
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            />
          </>
        )}
        {error && <p role="alert" className="admin-error">{error}</p>}
        {message && <p role="status" className="admin-success">{message}</p>}
        <button type="submit" disabled={busy}>{busy ? "Please wait…" : codeSent ? "Verify and sign in" : "Send verification code"}</button>
        {codeSent && !busy && (
          <button className="admin-text-button" type="button" onClick={() => { setCodeSent(false); setCode(""); setError(""); setMessage(""); }}>
            Use a different phone number
          </button>
        )}
        <Link to="/login">Back to TripMesh</Link>
      </form>
    </main>
  );
}
