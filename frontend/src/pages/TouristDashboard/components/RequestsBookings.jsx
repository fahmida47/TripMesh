import { useEffect, useRef, useState } from "react";

import MyRequests from "./MyRequests";
import TouristSidebar from "./TouristSidebar";

import "./RequestsBookings.css";

export default function RequestsBookings({ onProceedToPayment }) {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  return (
    <>
      <TouristSidebar />

      <div className="rb-page">
        <div className="rb-header">
          <h1>My Requests</h1>
          <p>Manage your tour requests in one place.</p>
        </div>

        <MyRequests
          onToast={showToast}
          onProceedToPayment={onProceedToPayment}
        />

        {toast && (
          <div className="rb-toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
