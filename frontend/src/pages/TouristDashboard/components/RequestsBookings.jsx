import { useEffect, useRef, useState } from "react";
import MyRequests from "./MyRequests";
import "./RequestsBookings.css";

/**
 * "My Requests" — opened from the sidebar's "My Bookings" nav item.
 * Currently backed by empty state only; data will populate here once the
 * backend/auth is wired up (each request belongs to the logged-in tourist).
 */
export default function RequestsBookings() {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <div className="rb-page">
      <div className="rb-header">
        <h1>My Requests</h1>
        <p>Manage your tour requests in one place.</p>
      </div>

      <MyRequests onToast={showToast} />

      {toast && <div className="rb-toast" role="status">{toast}</div>}
    </div>
  );
}
