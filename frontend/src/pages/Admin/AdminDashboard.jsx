import { useCallback, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Percent,
  CalendarDays,
  MapPinned,
  Users,
  Star,
  Settings,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import logo from "../../assets/logo.png";
import NotificationBell from "../../components/Notifications/NotificationBell";
import "./admin.css";
import { API_BASE_URL } from "../../config.js";
import {
  clearSession,
  getStoredUser,
  getToken,
} from "../../utils/auth.js";

const API = `${API_BASE_URL}/admin`;

const links = [
  ["/admin/dashboard", "Overview", LayoutDashboard],
  ["/admin/payments", "Payments", CreditCard],
  ["/admin/commissions", "Commissions", Percent],
  ["/admin/bookings", "Bookings", CalendarDays],
  ["/admin/guides", "Guides", MapPinned],
  ["/admin/tourists", "Tourists", Users],
  ["/admin/reviews", "Review approvals", Star],
  ["/admin/chat", "Chat", MessageCircle],
  ["/admin/profile", "Profile settings", Settings],
];

const readUser = getStoredUser;

function authHeaders(json = true) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${getToken() || ""}`,
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...authHeaders(!options.noJson),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.message || "Unable to load admin data."
    );
  }

  return body;
}

export function AdminGuard({ children }) {
  const user = readUser();

  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    !getToken()
  ) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <Navigate
        to={
          user?.role === "guide"
            ? "/guide-dashboard"
            : user?.role === "tourist"
              ? "/tourist-dashboard"
              : "/login"
        }
        replace
      />
    );
  }

  return children;
}

export default function AdminDashboard() {
  const user = readUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    const token = getToken();
    clearSession();
    navigate("/", { replace: true });

    if (token) {
      fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        // The local session is already cleared if the API is unavailable.
      });
    }
  };

  const currentTitle =
    links.find(([to]) => to === location.pathname)?.[1] ||
    "Overview";

  return (
    <div className="admin-shell">
      <aside
        id="admin-navigation"
        className={`admin-sidebar ${
          menuOpen ? "is-open" : ""
        }`}
      >
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <Link
          className="admin-brand"
          to="/admin/dashboard"
        >
          <span>
            <img src={logo} alt="" />
          </span>

          <b>
            TripMesh <small>ADMIN</small>
          </b>
        </Link>

        <div className="admin-nav-label">
          WORKSPACE
        </div>

        <nav>
          {links.map(([to, label, Icon]) => (
            <Link
              key={to}
              className={
                location.pathname === to ? "active" : ""
              }
              to={to}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <button
          className="admin-logout"
          onClick={logout}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {menuOpen && (
        <button
          className="admin-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="admin-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div>
            <span>Admin workspace</span>
            <h1>{currentTitle}</h1>
          </div>

          <div className="admin-topbar-right">
            <NotificationBell variant="light" />

            <div className="admin-user">
              <span className="admin-avatar">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </span>

              <div>
                <b>{user?.name || "Administrator"}</b>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function useAdminData(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setData(await api(path));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    error,
    loading,
    refresh,
    setData,
  };
}

function PageState({
  loading,
  error,
  children,
}) {
  if (loading) {
    return (
      <div className="admin-empty">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        {error}
      </div>
    );
  }

  return children;
}

function Stat({ label, value, tone }) {
  return (
    <article
      className={`admin-stat ${tone || ""}`}
    >
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </article>
  );
}

function currency(value) {
  return `৳${Number(value || 0).toLocaleString(
    "en-BD",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function rateFor(amount, slabs = []) {
  const tier = slabs.find(
    (slab) =>
      slab.max_amount === null ||
      slab.max_amount === undefined ||
      Number(amount) <= Number(slab.max_amount)
  );

  return Number(tier?.rate ?? 10);
}

function rows(data) {
  if (Array.isArray(data)) {
    return data;
  }

  const page = data?.data;

  if (Array.isArray(page)) {
    return page;
  }

  return Array.isArray(page?.data)
    ? page.data
    : [];
}

export function AdminOverview() {
  const { data, loading, error } =
    useAdminData("/dashboard");

  const stats = data?.stats || {};

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <div className="admin-welcome">
        <div>
          <span>LIVE PLATFORM SUMMARY</span>

          <h2>
            Good to see you,{" "}
            {readUser()?.name?.split(" ")[0] ||
              "Admin"}
          </h2>

          <p>
            Track TripMesh activity and review the
            items waiting for your attention.
          </p>
        </div>

        <span className="admin-status-pill">
          System active
        </span>
      </div>

      <div className="admin-stats-grid">
        <Stat
          label="Total tourists"
          value={stats.tourists}
        />

        <Stat
          label="Total guides"
          value={stats.guides}
        />

        <Stat
          label="Total bookings"
          value={stats.bookings}
        />

        <Stat
          label="Pending reviews"
          value={stats.pending_reviews}
          tone="amber"
        />

        <Stat
          label="Pending payments"
          value={stats.pending_payments}
          tone="amber"
        />

        <Stat
          label="Payment total"
          value={currency(
            stats.payment_total
          )}
          tone="blue"
        />

        <Stat
          label="TripMesh commission"
          value={currency(
            stats.commission_total
          )}
          tone="green"
        />
      </div>

      <div className="admin-callout">
        <div>
          <b>Moderation queue</b>

          <p>
            Tourist reviews are hidden from guides
            until approved.
          </p>
        </div>

        <Link to="/admin/reviews">
          Review submissions →
        </Link>
      </div>
    </PageState>
  );
}

export function AdminList({ kind }) {
  const titles = {
    bookings: "Booking history",
    guides: "Guide management",
    tourists: "Tourist management",
  };

  const { data, loading, error } =
    useAdminData(`/${kind}`);

  const items = rows(data);

  const columns =
    kind === "bookings"
      ? [
          "Booking",
          "Tourist",
          "Guide",
          "Dates",
          "Amount",
          "Status",
        ]
      : [
          "Name",
          "Phone",
          "Joined",
          "Role",
        ];

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{titles[kind]}</h2>

            <p>
              {data?.total ?? items.length} records
            </p>
          </div>
        </div>

        {items.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.map((item) =>
                  kind === "bookings" ? (
                    <tr key={item.id}>
                      <td>#{item.id}</td>

                      <td>
                        {item.tourist?.user
                          ?.name || "—"}
                      </td>

                      <td>
                        {item.guide
                          ?.company_name ||
                          item.guide?.user
                            ?.name ||
                          "—"}
                      </td>

                      <td>
                        {item.from_date || "—"} –{" "}
                        {item.to_date || "—"}
                      </td>

                      <td>
                        {currency(
                          item.amount
                        )}
                      </td>

                      <td>
                        <span className="admin-badge">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.id}>
                      <td>
                        {item.name ||
                          item.full_name ||
                          item.company_name ||
                          "—"}
                      </td>

                      <td>
                        {item.phone || "—"}
                      </td>

                      <td>
                        {(item.created_at ||
                          "").slice(0, 10) ||
                          "—"}
                      </td>

                      <td>
                        {item.role ||
                          (kind ===
                          "guides"
                            ? "guide"
                            : "tourist")}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            No {kind} to show yet.
          </div>
        )}
      </div>
    </PageState>
  );
}

export function AdminPayments() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAdminData("/payments");

  const payments = rows(data);

  const update = async (id, status) => {
    try {
      await api(`/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      await refresh();
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Payment history</h2>

            <p>
              Review submitted details and approve
              or reject payments.
            </p>
          </div>
        </div>

        {payments.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Tourist</th>
                  <th>Method</th>
                  <th>
                    Account / transaction
                  </th>
                  <th>Submitted</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => {
                  const rate = rateFor(
                    payment.amount,
                    data?.commission_slabs ||
                      []
                  );

                  const reviewable = [
                    "pending",
                    "pending_review",
                  ].includes(
                    payment.status
                  );

                  return (
                    <tr key={payment.id}>
                      <td>
                        #{payment.booking_id}
                      </td>

                      <td>
                        {payment.booking
                          ?.tourist?.user
                          ?.name || "—"}
                      </td>

                      <td>
                        {payment.method ||
                          "—"}
                      </td>

                      <td>
                        {payment.account_number ||
                          "—"}

                        <small className="table-sub">
                          {payment.transaction_reference ||
                            "No transaction reference"}
                        </small>
                      </td>

                      <td>
                        {payment.payment_date_time
                          ? new Date(
                              payment.payment_date_time
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        {currency(
                          payment.amount
                        )}
                      </td>

                      <td>
                        {currency(
                          (Number(
                            payment.amount ||
                              0
                          ) *
                            rate) /
                            100
                        )}

                        <small className="table-sub">
                          {rate}%
                        </small>
                      </td>

                      <td>
                        <span
                          className={`admin-badge ${
                            payment.status ===
                            "paid"
                              ? "good"
                              : payment.status ===
                                  "rejected"
                                ? "bad"
                                : "pending"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="admin-actions">
                        {reviewable ? (
                          <>
                            <button
                              type="button"
                              disabled={
                                !payment.method
                              }
                              onClick={() =>
                                update(
                                  payment.id,
                                  "paid"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="reject"
                              disabled={
                                !payment.method
                              }
                              onClick={() =>
                                update(
                                  payment.id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`admin-badge ${
                              payment.status ===
                              "paid"
                                ? "good"
                                : "bad"
                            }`}
                          >
                            {payment.status ===
                            "paid"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            No payment records yet.
          </div>
        )}
      </div>
    </PageState>
  );
}

export function AdminCommissions() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAdminData("/commissions");

  const items = rows(data);

  const [slabs, setSlabs] =
    useState([]);
  const [notice, setNotice] =
    useState("");
  const [
    releaseNotice,
    setReleaseNotice,
  ] = useState("");
  const [
    selectedPayout,
    setSelectedPayout,
  ] = useState(null);
  const [
    transferConfirmed,
    setTransferConfirmed,
  ] = useState(false);
  const [releasing, setReleasing] =
    useState(false);
  const [
    releaseError,
    setReleaseError,
  ] = useState("");

  useEffect(() => {
    if (
      Array.isArray(
        data?.commission_slabs
      )
    ) {
      setSlabs(
        data.commission_slabs.map(
          (slab) => ({
            ...slab,
          })
        )
      );
    }
  }, [data]);

  const saveSlabs = async (event) => {
    event.preventDefault();
    setNotice("");

    try {
      const payload = slabs.map(
        (slab) => ({
          max_amount:
            slab.max_amount === ""
              ? null
              : slab.max_amount,
          rate: Number(slab.rate),
        })
      );

      const result = await api(
        "/commission",
        {
          method: "PUT",
          body: JSON.stringify({
            slabs: payload,
          }),
        }
      );

      setNotice(result.message);
      await refresh();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const addSlab = () =>
    setSlabs((current) => {
      if (!current.length) {
        return [
          {
            max_amount: 5000,
            rate: 12,
          },
          {
            max_amount: null,
            rate: 8,
          },
        ];
      }

      const next = current.map(
        (slab) => ({
          ...slab,
        })
      );

      const last =
        next[next.length - 1];

      if (
        last.max_amount === null
      ) {
        last.max_amount =
          Number(
            next[next.length - 2]
              ?.max_amount || 0
          ) + 15000;
      }

      next.push({
        max_amount: null,
        rate: last.rate,
      });

      return next;
    });

  const removeSlab = (index) =>
    setSlabs((current) => {
      const next = current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

      if (
        index ===
          current.length - 1 &&
        next.length
      ) {
        next[
          next.length - 1
        ].max_amount = null;
      }

      return next;
    });

  const updateSlab = (
    index,
    key,
    value
  ) =>
    setSlabs((current) =>
      current.map(
        (slab, itemIndex) =>
          itemIndex === index
            ? {
                ...slab,
                [key]: value,
              }
            : slab
      )
    );

  const release = async () => {
    if (
      !selectedPayout ||
      !transferConfirmed ||
      releasing
    ) {
      return;
    }

    setReleasing(true);
    setReleaseError("");
    setReleaseNotice("");

    try {
      const result = await api(
        `/payouts/${selectedPayout.id}/release`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );

      setReleaseNotice(
        result.message
      );
      setSelectedPayout(null);
      setTransferConfirmed(false);

      await refresh();
    } catch (error) {
      setReleaseError(
        error.message
      );
    } finally {
      setReleasing(false);
    }
  };

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <form
        className="admin-commission-settings"
        onSubmit={saveSlabs}
      >
        <div className="admin-tier-intro">
          <h2>
            Commission by booking price
          </h2>

          <p>
            Each approved payment uses the rate
            for its booking amount. Past payouts
            keep the rate recorded when they
            were approved.
          </p>
        </div>

        <div className="admin-tier-list">
          {slabs.map(
            (slab, index) => (
              <div
                className="admin-tier-row"
                key={index}
              >
                <span className="admin-tier-index">
                  {index + 1}
                </span>

                <label>
                  {index ===
                  slabs.length - 1
                    ? "Price range"
                    : "Up to (৳)"}

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required={
                      index !==
                      slabs.length - 1
                    }
                    disabled={
                      index ===
                      slabs.length - 1
                    }
                    placeholder="No upper limit"
                    value={
                      index ===
                      slabs.length - 1
                        ? ""
                        : slab.max_amount ??
                          ""
                    }
                    onChange={(
                      event
                    ) =>
                      updateSlab(
                        index,
                        "max_amount",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  Commission (%)

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={slab.rate}
                    onChange={(
                      event
                    ) =>
                      updateSlab(
                        index,
                        "rate",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                {slabs.length >
                  1 && (
                  <button
                    className="admin-tier-remove"
                    type="button"
                    onClick={() =>
                      removeSlab(
                        index
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          )}
        </div>

        <div className="admin-tier-actions">
          <button
            className="admin-tier-add"
            type="button"
            onClick={addSlab}
          >
            + Add price tier
          </button>

          <button type="submit">
            Save commission tiers
          </button>
        </div>

        {notice && (
          <span className="admin-tier-notice">
            {notice}
          </span>
        )}
      </form>

      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>
              Commission and guide payouts
            </h2>

            <p>
              Transfer the guide net amount to
              the payout bKash number, then
              mark it paid.
            </p>
          </div>
        </div>

        {releaseNotice && (
          <div className="admin-notice">
            {releaseNotice}
          </div>
        )}

        {items.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>
                    Guide company / bKash
                  </th>
                  <th>Gross</th>
                  <th>Rate</th>
                  <th>Commission</th>
                  <th>Guide net</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      #{item.payment_id}
                    </td>

                    <td>
                      {item.guide
                        ?.company_name ||
                        item.guide?.user
                          ?.name ||
                        "—"}

                      <small className="table-sub">
                        bKash:{" "}
                        {item.guide
                          ?.payout_bkash_number ||
                          "Not set"}
                      </small>
                    </td>

                    <td>
                      {currency(
                        item.gross_amount
                      )}
                    </td>

                    <td>
                      {
                        item.commission_rate
                      }
                      %
                    </td>

                    <td>
                      {currency(
                        item.commission_amount
                      )}
                    </td>

                    <td>
                      {currency(
                        item.net_amount
                      )}
                    </td>

                    <td>
                      <span
                        className={`admin-badge ${
                          item.status ===
                          "paid"
                            ? "good"
                            : "pending"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.status ===
                      "pending" ? (
                        <button
                          className="admin-payout-release"
                          type="button"
                          onClick={() => {
                            setSelectedPayout(
                              item
                            );
                            setTransferConfirmed(
                              false
                            );
                            setReleaseError(
                              ""
                            );
                          }}
                        >
                          Mark paid
                        </button>
                      ) : (
                        <span>
                          {item.paid_at
                            ? new Date(
                                item.paid_at
                              ).toLocaleDateString()
                            : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            Guide payout records appear after
            payment approval.
          </div>
        )}
      </div>

      {selectedPayout && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !releasing
            ) {
              setSelectedPayout(
                null
              );
            }
          }}
        >
          <section
            className="admin-payout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payout-modal-title"
          >
            <div className="admin-payout-modal-head">
              <span className="admin-modal-icon">
                ৳
              </span>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={() =>
                  setSelectedPayout(
                    null
                  )
                }
                disabled={releasing}
              >
                ×
              </button>
            </div>

            <h2 id="payout-modal-title">
              Confirm guide payout
            </h2>

            <p>
              Send this amount to the guide's
              payout bKash number before
              confirming.
            </p>

            <div className="admin-payout-summary">
              <span>
                Guide company
              </span>

              <b>
                {selectedPayout
                  .guide
                  ?.company_name ||
                  selectedPayout
                    .guide?.user?.name ||
                  "Guide company"}
              </b>

              <span>
                Guide bKash number
              </span>

              <b>
                {selectedPayout
                  .guide
                  ?.payout_bkash_number ||
                  "Not set"}
              </b>

              <span>
                Amount to transfer
              </span>

              <b>
                {currency(
                  selectedPayout.net_amount
                )}
              </b>

              <span>
                TripMesh commission
              </span>

              <b>
                {currency(
                  selectedPayout.commission_amount
                )}{" "}
                (
                {
                  selectedPayout.commission_rate
                }
                %)
              </b>
            </div>

            <label className="admin-transfer-confirm">
              <input
                type="checkbox"
                checked={
                  transferConfirmed
                }
                onChange={(event) =>
                  setTransferConfirmed(
                    event.target.checked
                  )
                }
              />

              <span>
                I have sent this amount to the
                guide company.
              </span>
            </label>

            {releaseError && (
              <div className="admin-error">
                {releaseError}
              </div>
            )}

            <div className="admin-payout-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                onClick={() =>
                  setSelectedPayout(
                    null
                  )
                }
                disabled={releasing}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-payout-release"
                onClick={release}
                disabled={
                  !transferConfirmed ||
                  !selectedPayout
                    .guide
                    ?.payout_bkash_number ||
                  releasing
                }
              >
                {releasing
                  ? "Saving…"
                  : "Confirm payout"}
              </button>
            </div>
          </section>
        </div>
      )}
    </PageState>
  );
}

export function AdminReviews() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAdminData("/reviews");

  const reviews = rows(data);

  const update = async (
    id,
    status
  ) => {
    try {
      await api(`/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      await refresh();
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <div className="admin-review-list">
        {reviews.length ? (
          reviews.map(
            (review) => (
              <article
                className="admin-review-card"
                key={review.id}
              >
                <div className="admin-review-head">
                  <div>
                    <span className="admin-badge pending">
                      {
                        review.status
                      }
                    </span>

                    <h3>
                      {review
                        .tourist
                        ?.user?.name ||
                        review
                          .tourist
                          ?.full_name ||
                        "Tourist"}{" "}
                      <span>→</span>{" "}
                      {review
                        .guide
                        ?.company_name ||
                        review
                          .guide
                          ?.user
                          ?.name ||
                        "Guide"}
                    </h3>
                  </div>

                  <strong>
                    ★ {review.rating}
                    /5
                  </strong>
                </div>

                <p>
                  {review.review}
                </p>

                <footer>
                  <span>
                    Booking #
                    {
                      review.booking_id
                    }{" "}
                    ·{" "}
                    {(
                      review.submitted_at ||
                      ""
                    ).slice(
                      0,
                      10
                    )}
                  </span>

                  {review.status ===
                    "pending" && (
                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() =>
                          update(
                            review.id,
                            "approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        className="reject"
                        onClick={() =>
                          update(
                            review.id,
                            "rejected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </footer>
              </article>
            )
          )
        ) : (
          <div className="admin-empty">
            No reviews have been submitted.
          </div>
        )}
      </div>
    </PageState>
  );
}

export function AdminProfile() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAdminData("/profile");

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
    });

  const [admin, setAdmin] =
    useState({
      name: "",
      phone: "",
    });

  const [notice, setNotice] =
    useState("");
  const [failure, setFailure] =
    useState("");

  useEffect(() => {
    if (data?.user) {
      setForm({
        name:
          data.user.name || "",
        phone:
          data.user.phone || "",
      });
    }
  }, [data]);

  const save = async (event) => {
    event.preventDefault();

    setNotice("");
    setFailure("");

    try {
      const result = await api(
        "/profile",
        {
          method: "PUT",
          body: JSON.stringify(
            form
          ),
        }
      );

      setNotice(result.message);

      localStorage.setItem(
        "user",
        JSON.stringify(
          result.user
        )
      );

      await refresh();
    } catch (error) {
      setFailure(
        error.message
      );
    }
  };

  const addAdmin = async (
    event
  ) => {
    event.preventDefault();

    setNotice("");
    setFailure("");

    try {
      const result = await api(
        "/admins",
        {
          method: "POST",
          body: JSON.stringify(
            admin
          ),
        }
      );

      setNotice(
        `${result.message} They can now use Admin sign in.`
      );

      setAdmin({
        name: "",
        phone: "",
      });
    } catch (error) {
      setFailure(
        error.message
      );
    }
  };

  return (
    <PageState
      loading={loading}
      error={error}
    >
      <div className="admin-profile-grid">
        <form
          className="admin-panel admin-form"
          onSubmit={save}
        >
          <h2>
            Profile settings
          </h2>

          <p>
            Update the name and phone number on
            your admin account.
          </p>

          <label>
            Name

            <input
              required
              maxLength={255}
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <label>
            Phone number

            <input
              required
              minLength={10}
              maxLength={20}
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <button type="submit">
            Save profile
          </button>
        </form>

        <form
          className="admin-panel admin-form"
          onSubmit={addAdmin}
        >
          <h2>
            Add administrator
          </h2>

          <p>
            New administrators can sign in with
            phone OTP. This action is recorded
            through the protected admin API.
          </p>

          <label>
            Name

            <input
              required
              maxLength={255}
              value={admin.name}
              onChange={(event) =>
                setAdmin({
                  ...admin,
                  name:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <label>
            Phone number

            <input
              required
              minLength={10}
              maxLength={20}
              value={admin.phone}
              onChange={(event) =>
                setAdmin({
                  ...admin,
                  phone:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <button type="submit">
            Add admin account
          </button>
        </form>
      </div>

      {(notice || failure) && (
        <div
          className={
            failure
              ? "admin-error"
              : "admin-notice"
          }
        >
          {failure || notice}
        </div>
      )}
    </PageState>
  );
}
