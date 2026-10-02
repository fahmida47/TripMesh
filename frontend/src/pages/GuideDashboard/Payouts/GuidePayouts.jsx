import { useEffect, useState } from "react";
import { BadgeCheck, CircleDollarSign, Clock3 } from "lucide-react";
import "./GuidePayouts.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function formatAmount(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function GuidePayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPayouts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please sign in again to view your payouts.");
        }

        const response = await fetch(`${API_BASE_URL}/guide/payouts`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load payout history.");
        }

        setPayouts(Array.isArray(data.payouts) ? data.payouts : []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load payout history.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPayouts();
    return () => controller.abort();
  }, []);

  const totalNet = payouts.reduce(
    (total, payout) => total + Number(payout.net_amount || 0),
    0,
  );
  const totalPaid = payouts
    .filter((payout) => payout.status === "paid")
    .reduce((total, payout) => total + Number(payout.net_amount || 0), 0);
  const totalPending = payouts
    .filter((payout) => payout.status === "pending")
    .reduce((total, payout) => total + Number(payout.net_amount || 0), 0);

  return (
    <main className="guide-payouts-page">
      <header className="guide-payouts-heading">
        <div>
          <h1>Payouts</h1>
          <p>Track your earnings, releases, and payout history.</p>
        </div>
      </header>

      {error && <p className="payout-page-message error" role="alert">{error}</p>}

      <section className="payout-summary-grid" aria-label="Payout totals">
        <article className="payout-summary-card">
          <span className="payout-summary-icon total"><CircleDollarSign size={19} /></span>
          <div>
            <span>Total net earnings</span>
            <strong>{loading ? "—" : formatAmount(totalNet)}</strong>
          </div>
        </article>

        <article className="payout-summary-card">
          <span className="payout-summary-icon paid"><BadgeCheck size={19} /></span>
          <div>
            <span>Paid to you</span>
            <strong>{loading ? "—" : formatAmount(totalPaid)}</strong>
          </div>
        </article>

        <article className="payout-summary-card">
          <span className="payout-summary-icon pending"><Clock3 size={19} /></span>
          <div>
            <span>Pending release</span>
            <strong>{loading ? "—" : formatAmount(totalPending)}</strong>
          </div>
        </article>
      </section>

      <section className="payout-history-section">
        <div className="payout-history-heading">
          <div>
            <h2>Payout history</h2>
            <p>Net amount is the amount payable to you after commission.</p>
          </div>
          {!loading && !error && <span>{payouts.length} records</span>}
        </div>

        {loading ? (
          <div className="payout-empty-state">Loading payout history...</div>
        ) : error ? (
          <div className="payout-empty-state">Payout history could not be loaded.</div>
        ) : payouts.length === 0 ? (
          <div className="payout-empty-state">
            <h3>No payouts yet</h3>
            <p>Approved guide payouts will appear here.</p>
          </div>
        ) : (
          <div className="payout-table-wrap">
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net amount</th>
                  <th>Status</th>
                  <th>Paid date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => {
                  const booking = payout.payment?.booking;
                  const title = booking?.experience?.title
                    || booking?.tour_type
                    || `Booking #${booking?.id || "—"}`;

                  return (
                    <tr key={payout.id}>
                      <td data-label="Booking">
                        <strong>{title}</strong>
                        <small>{booking?.id ? `Booking #${booking.id}` : "Guide service payout"}</small>
                      </td>
                      <td data-label="Gross">{formatAmount(payout.gross_amount)}</td>
                      <td data-label="Commission">{formatAmount(payout.commission_amount)}</td>
                      <td className="payout-net-amount" data-label="Net amount">
                        {formatAmount(payout.net_amount)}
                      </td>
                      <td data-label="Status">
                        <span className={`payout-status ${payout.status}`}>
                          {payout.status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td data-label="Paid date">{formatDate(payout.paid_at)}</td>
                      <td className="payout-reference" data-label="Reference">
                        {payout.payout_reference || "Not released"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default GuidePayouts;