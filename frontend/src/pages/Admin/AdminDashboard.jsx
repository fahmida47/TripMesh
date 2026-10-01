import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, CreditCard, Percent, CalendarDays, MapPinned, Users, Star, Settings, LogOut, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import "./admin.css";

const API = "http://127.0.0.1:8000/api/admin";
const links = [
  ["/admin/dashboard", "Overview", LayoutDashboard],
  ["/admin/payments", "Payments", CreditCard],
  ["/admin/commissions", "Commissions", Percent],
  ["/admin/bookings", "Bookings", CalendarDays],
  ["/admin/guides", "Guides", MapPinned],
  ["/admin/tourists", "Tourists", Users],
  ["/admin/reviews", "Review approvals", Star],
  ["/admin/profile", "Profile settings", Settings],
];

function readUser() { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } }
function authHeaders(json = true) {
  const headers = { Accept: "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}
async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...authHeaders(!options.noJson), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Unable to load admin data.");
  return body;
}

export function AdminGuard({ children }) {
  const user = readUser();
  if (localStorage.getItem("isLoggedIn") !== "true" || !localStorage.getItem("token")) return <Navigate to="/admin/login" replace />;
  if (user?.role !== "admin") return <Navigate to={user?.role === "guide" ? "/guide-dashboard" : user?.role === "tourist" ? "/tourist-dashboard" : "/admin/login"} replace />;
  return children;
}

export default function AdminDashboard() {
  const user = readUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* clear local session even if the token expired */ }
    ["token", "user", "isLoggedIn"].forEach((key) => localStorage.removeItem(key));
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <Link className="admin-brand" to="/admin/dashboard"><span><img src={logo} alt="" /></span><b>TripMesh <small>ADMIN</small></b></Link>
        <div className="admin-nav-label">WORKSPACE</div>
        <nav>{links.map(([to, label, Icon]) => <Link key={to} className={location.pathname === to ? "active" : ""} to={to} onClick={() => setMenuOpen(false)}><Icon size={18} />{label}</Link>)}</nav>
        <button className="admin-logout" onClick={logout}><LogOut size={18} />Sign out</button>
      </aside>
      {menuOpen && <button className="admin-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="admin-main">
        <header className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button><div><span>Admin workspace</span><h1>{links.find(([to]) => to === location.pathname)?.[1] || "Overview"}</h1></div><div className="admin-user"><span className="admin-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</span><div><b>{user?.name || "Administrator"}</b><small>Administrator</small></div></div></header>
        <section className="admin-content"><Outlet /></section>
      </main>
    </div>
  );
}

function useAdminData(path) {
  const [data, setData] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); setError(""); try { setData(await api(path)); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [path]);
  useEffect(() => { refresh(); }, [refresh]);
  return { data, error, loading, refresh, setData };
}

function PageState({ loading, error, children }) { return loading ? <div className="admin-empty">Loading…</div> : error ? <div className="admin-error">{error}</div> : children; }
function Stat({ label, value, tone }) { return <article className={`admin-stat ${tone || ""}`}><span>{label}</span><strong>{value ?? "—"}</strong></article>; }
function currency(value) { return `৳${Number(value || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function rows(data) {
  if (Array.isArray(data)) return data;
  const page = data?.data;
  if (Array.isArray(page)) return page;
  return Array.isArray(page?.data) ? page.data : [];
}

export function AdminOverview() {
  const { data, loading, error } = useAdminData("/dashboard"); const stats = data?.stats || {};
  return <PageState loading={loading} error={error}><div className="admin-welcome"><div><span>LIVE PLATFORM SUMMARY</span><h2>Good to see you, {readUser()?.name?.split(" ")[0] || "Admin"}</h2><p>Track TripMesh activity and review the items waiting for your attention.</p></div><span className="admin-status-pill">System active</span></div><div className="admin-stats-grid"><Stat label="Total tourists" value={stats.tourists} /><Stat label="Total guides" value={stats.guides} /><Stat label="Total bookings" value={stats.bookings} /><Stat label="Pending reviews" value={stats.pending_reviews} tone="amber" /><Stat label="Pending payments" value={stats.pending_payments} tone="amber" /><Stat label="Payment total" value={currency(stats.payment_total)} tone="blue" /><Stat label="TripMesh commission" value={currency(stats.commission_total)} tone="green" /></div><div className="admin-callout"><div><b>Moderation queue</b><p>Tourist reviews are hidden from guides until approved.</p></div><Link to="/admin/reviews">Review submissions →</Link></div></PageState>;
}

export function AdminList({ kind }) {
  const titles = { bookings: "Booking history", guides: "Guide management", tourists: "Tourist management" };
  const { data, loading, error } = useAdminData(`/${kind}`); const items = rows(data);
  const cols = kind === "bookings" ? ["Booking", "Tourist", "Guide", "Dates", "Amount", "Status"] : ["Name", "Phone", "Joined", "Role"];
  return <PageState loading={loading} error={error}><div className="admin-panel"><div className="admin-panel-heading"><div><h2>{titles[kind]}</h2><p>{data?.total ?? items.length} records</p></div></div>{items.length ? <div className="admin-table-wrap"><table><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{items.map((item) => kind === "bookings" ? <tr key={item.id}><td>#{item.id}</td><td>{item.tourist?.user?.name || "—"}</td><td>{item.guide?.company_name || item.guide?.user?.name || "—"}</td><td>{item.from_date || "—"} – {item.to_date || "—"}</td><td>{currency(item.amount)}</td><td><span className="admin-badge">{item.status}</span></td></tr> : <tr key={item.id}><td>{item.name || item.full_name || item.company_name || "—"}</td><td>{item.phone || "—"}</td><td>{(item.created_at || "").slice(0, 10) || "—"}</td><td>{item.role || (kind === "guides" ? "guide" : "tourist")}</td></tr>)}</tbody></table></div> : <div className="admin-empty">No {kind} to show yet.</div>}</div></PageState>;
}

export function AdminPayments() {
  const { data, loading, error, refresh } = useAdminData("/payments"); const payments = rows(data);
  const update = async (id, status) => { try { await api(`/payments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await refresh(); } catch (e) { window.alert(e.message); } };
  const rate = Number(data?.commission_rate ?? 10);
  return <PageState loading={loading} error={error}><div className="admin-panel"><div className="admin-panel-heading"><div><h2>Payment history</h2><p>Review submitted details and approve or reject payments.</p></div></div>{payments.length ? <div className="admin-table-wrap"><table><thead><tr><th>Booking</th><th>Tourist</th><th>Method</th><th>Account / transaction</th><th>Submitted</th><th>Amount</th><th>Commission ({rate}%)</th><th>Status</th><th>Action</th></tr></thead><tbody>{payments.map((p) => <tr key={p.id}><td>#{p.booking_id}</td><td>{p.booking?.tourist?.user?.name || "—"}</td><td>{p.method || "—"}</td><td>{p.account_number || "—"}<small className="table-sub">{p.transaction_reference || "No transaction reference"}</small></td><td>{p.payment_date_time ? new Date(p.payment_date_time).toLocaleString() : "—"}</td><td>{currency(p.amount)}</td><td>{currency(Number(p.amount || 0) * rate / 100)}</td><td><span className={`admin-badge ${p.status === "paid" ? "good" : p.status === "rejected" ? "bad" : "pending"}`}>{p.status}</span></td><td className="admin-actions"><button disabled={!['pending', 'pending_review'].includes(p.status) || !p.method} onClick={() => update(p.id, "paid")}>Approve</button><button className="reject" disabled={!['pending', 'pending_review'].includes(p.status) || !p.method} onClick={() => update(p.id, "rejected")}>Reject</button></td></tr>)}</tbody></table></div> : <div className="admin-empty">No payment records yet.</div>}</div></PageState>;
}

export function AdminCommissions() {
  const { data, loading, error, refresh } = useAdminData("/commissions"); const items = rows(data); const [rate, setRate] = useState("10"); const [notice, setNotice] = useState("");
  useEffect(() => { if (data?.commission_rate !== undefined) setRate(String(data.commission_rate)); }, [data]);
  const saveRate = async (event) => { event.preventDefault(); setNotice(""); try { const result = await api("/commission", { method: "PUT", body: JSON.stringify({ commission_rate: Number(rate) }) }); setNotice(result.message); await refresh(); } catch (e) { setNotice(e.message); } };
  return <PageState loading={loading} error={error}><form className="admin-commission-settings" onSubmit={saveRate}><label>TripMesh commission rate (%)<input type="number" min="0" max="100" step="0.01" required value={rate} onChange={(e) => setRate(e.target.value)} /></label><button>Save rate</button>{notice && <span>{notice}</span>}</form><div className="admin-panel"><div className="admin-panel-heading"><div><h2>Commission history</h2><p>Approved payment splits at the current rate of {data?.commission_rate ?? rate}%.</p></div></div>{items.length ? <div className="admin-table-wrap"><table><thead><tr><th>Payment</th><th>Guide</th><th>Gross</th><th>Rate</th><th>Commission</th><th>Guide net</th><th>Payout status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>#{item.payment_id}</td><td>{item.guide?.company_name || item.guide?.user?.name || "—"}</td><td>{currency(item.gross_amount)}</td><td>{item.commission_rate}%</td><td>{currency(item.commission_amount)}</td><td>{currency(item.net_amount)}</td><td>{item.status}</td></tr>)}</tbody></table></div> : <div className="admin-empty">Commission entries appear after payment approval.</div>}</div></PageState>;
}

export function AdminReviews() {
  const { data, loading, error, refresh } = useAdminData("/reviews"); const reviews = rows(data);
  const update = async (id, status) => { try { await api(`/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await refresh(); } catch (e) { window.alert(e.message); } };
  return <PageState loading={loading} error={error}><div className="admin-review-list">{reviews.length ? reviews.map((review) => <article className="admin-review-card" key={review.id}><div className="admin-review-head"><div><span className="admin-badge pending">{review.status}</span><h3>{review.tourist?.user?.name || review.tourist?.full_name || "Tourist"} <span>→</span> {review.guide?.company_name || review.guide?.user?.name || "Guide"}</h3></div><strong>★ {review.rating}/5</strong></div><p>{review.review}</p><footer><span>Booking #{review.booking_id} · {(review.submitted_at || "").slice(0, 10)}</span>{review.status === "pending" && <div className="admin-actions"><button onClick={() => update(review.id, "approved")}>Approve</button><button className="reject" onClick={() => update(review.id, "rejected")}>Reject</button></div>}</footer></article>) : <div className="admin-empty">No reviews have been submitted.</div>}</div></PageState>;
}

export function AdminProfile() {
  const { data, loading, error, refresh } = useAdminData("/profile");
  const [form, setForm] = useState({ name: "", phone: "" }); const [admin, setAdmin] = useState({ name: "", phone: "" }); const [notice, setNotice] = useState(""); const [failure, setFailure] = useState("");
  useEffect(() => { if (data?.user) setForm({ name: data.user.name || "", phone: data.user.phone || "" }); }, [data]);
  const save = async (e) => { e.preventDefault(); setNotice(""); setFailure(""); try { const result = await api("/profile", { method: "PUT", body: JSON.stringify(form) }); setNotice(result.message); localStorage.setItem("user", JSON.stringify(result.user)); await refresh(); } catch (err) { setFailure(err.message); } };
  const addAdmin = async (e) => { e.preventDefault(); setNotice(""); setFailure(""); try { const result = await api("/admins", { method: "POST", body: JSON.stringify(admin) }); setNotice(`${result.message} They can now use Admin sign in.`); setAdmin({ name: "", phone: "" }); } catch (err) { setFailure(err.message); } };
  return <PageState loading={loading} error={error}><div className="admin-profile-grid"><form className="admin-panel admin-form" onSubmit={save}><h2>Profile settings</h2><p>Update the name and phone number on your admin account.</p><label>Name<input required maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Phone number<input required minLength={10} maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><button>Save profile</button></form><form className="admin-panel admin-form" onSubmit={addAdmin}><h2>Add administrator</h2><p>New administrators can sign in with phone OTP. This action is recorded through the protected admin API.</p><label>Name<input required maxLength={255} value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} /></label><label>Phone number<input required minLength={10} maxLength={20} value={admin.phone} onChange={(e) => setAdmin({ ...admin, phone: e.target.value })} /></label><button>Add admin account</button></form></div>{(notice || failure) && <div className={failure ? "admin-error" : "admin-notice"}>{failure || notice}</div>}</PageState>;
}
