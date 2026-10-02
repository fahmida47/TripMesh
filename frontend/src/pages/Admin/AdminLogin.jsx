import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config.js";
import { getStoredUser } from "../../utils/auth.js";

const API = API_BASE_URL;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API}/admin/auth/${sent ? "verify-code" : "send-code"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(sent ? { phone, code } : { phone }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Admin sign in failed.");
      if (!sent) {
        setSent(true);
        setMessage("Code generated. Check the backend terminal.");
      } else {
        if (result.user?.role !== "admin" || !result.token) throw new Error("Admin access denied.");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  };

  const user = getStoredUser();
  if (localStorage.getItem("isLoggedIn") === "true" && user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-eyebrow">TRIPMESH CONTROL ROOM</span>
        <h1>Admin sign in</h1>
        <p>Use the phone number registered for your admin account.</p>
        <label htmlFor="admin-phone">Phone number</label>
        <input id="admin-phone" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={sent} required minLength={10} maxLength={20} />
        {sent && <><label htmlFor="admin-code">6 digit verification code</label><input id="admin-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} required minLength={6} maxLength={6} /></>}
        {message && <div className="admin-notice">{message}</div>}
        {error && <div className="admin-error">{error}</div>}
        <button disabled={busy}>{busy ? "Please wait…" : sent ? "Verify and continue" : "Send verification code"}</button>
        {sent && <button className="admin-text-button" type="button" onClick={() => { setSent(false); setCode(""); setError(""); }}>Change phone number</button>}
      </form>
    </main>
  );
}
