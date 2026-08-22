import GuideHeader from "../components/GuideHeader";
import GuideSidebar from "../components/GuideSidebar";

import "./GuideRequests.css";

const GuideRequests = () => {
  const requests = [];

  // Request counts
  const allRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending",
  ).length;

  const acceptedRequests = requests.filter(
    (request) => request.status === "Accepted",
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "Rejected",
  ).length;

  const cancelledRequests = requests.filter(
    (request) => request.status === "Cancelled",
  ).length;

  return (
    <div className="guide-dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <GuideSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="guide-main-content">
        {/* ================= HEADER ================= */}
        <GuideHeader />

        {/* ================= REQUESTS ================= */}
        <section className="guide-requests-page">
          {/* Page Title */}
          <div className="guide-requests-header">
            <div>
              <h1>Requests</h1>

              <p>Manage travel requests from tourists.</p>
            </div>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="request-summary-grid">
            {/* ALL */}
            <div className="request-summary-card">
              <div className="summary-card-icon all">📋</div>

              <div className="summary-card-content">
                <span>All Requests</span>
                <h3>{allRequests}</h3>
              </div>
            </div>

            {/* PENDING */}
            <div className="request-summary-card">
              <div className="summary-card-icon pending">⏳</div>

              <div className="summary-card-content">
                <span>Pending</span>
                <h3>{pendingRequests}</h3>
              </div>
            </div>

            {/* ACCEPTED */}
            <div className="request-summary-card">
              <div className="summary-card-icon accepted">✓</div>

              <div className="summary-card-content">
                <span>Accepted</span>
                <h3>{acceptedRequests}</h3>
              </div>
            </div>

            {/* REJECTED */}
            <div className="request-summary-card">
              <div className="summary-card-icon rejected">✕</div>

              <div className="summary-card-content">
                <span>Rejected</span>
                <h3>{rejectedRequests}</h3>
              </div>
            </div>

            {/* CANCELLED */}
            <div className="request-summary-card">
              <div className="summary-card-icon cancelled">↶</div>

              <div className="summary-card-content">
                <span>Cancelled</span>
                <h3>{cancelledRequests}</h3>
              </div>
            </div>
          </div>

          {/* ================= EMPTY STATE ================= */}
          {requests.length === 0 && (
            <div className="requests-empty-state">
              <div className="requests-empty-icon">📩</div>

              <h2>No Requests Yet</h2>

              <p>
                You don't have any travel requests at the moment. New requests
                from tourists will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GuideRequests;
