import { useEffect, useState } from "react";

import "./GuideRequests.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const GuideRequests = () => {
  const [requests, setRequests] = useState([]);

  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/travel-requests/guide`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to fetch travel requests."
        );
      }

      setRequests(data.requests || []);

      setCounts({
        all: data.counts?.all || 0,
        pending: data.counts?.pending || 0,
        accepted: data.counts?.accepted || 0,
        rejected: data.counts?.rejected || 0,
        cancelled: data.counts?.cancelled || 0,
      });
    } catch (err) {
      console.error("Guide requests error:", err);

      setError(
        err.message || "Unable to load travel requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, action) => {
    try {
      setActionLoading(id);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/travel-requests/guide/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Show the actual backend error
      if (!response.ok) {
        console.error("Backend error response:", data);

        throw new Error(
          data.error ||
            data.message ||
            `Unable to ${action} request.`
        );
      }

      await fetchRequests();
    } catch (err) {
      console.error(`Request ${action} error:`, err);

      setError(
        err.message ||
          `Unable to ${action} request.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "pending";

    return status.toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTouristInitial = (name) => {
    if (!name) return "T";

    return name.charAt(0).toUpperCase();
  };

  return (
    <section className="guide-requests-page">

      {/* Page Header */}
      <div className="guide-requests-header">
        <div>
          <span className="requests-page-eyebrow">
            TRAVEL MANAGEMENT
          </span>

          <h1>Requests</h1>

          <p>
            Review and manage travel requests from tourists.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="refresh-requests-button"
        >
          <span className="refresh-icon">↻</span>

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="requests-error">
          <span className="error-icon">!</span>

          <div>
            <strong>Something went wrong</strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="request-summary-grid">

        <div className="request-summary-card all-card">
          <div className="summary-card-icon">
            <span>▣</span>
          </div>

          <div className="summary-card-content">
            <span>All Requests</span>
            <strong>{counts.all}</strong>
          </div>
        </div>

        <div className="request-summary-card pending-card">
          <div className="summary-card-icon">
            <span>◷</span>
          </div>

          <div className="summary-card-content">
            <span>Pending</span>
            <strong>{counts.pending}</strong>
          </div>
        </div>

        <div className="request-summary-card accepted-card">
          <div className="summary-card-icon">
            <span>✓</span>
          </div>

          <div className="summary-card-content">
            <span>Accepted</span>
            <strong>{counts.accepted}</strong>
          </div>
        </div>

        <div className="request-summary-card rejected-card">
          <div className="summary-card-icon">
            <span>×</span>
          </div>

          <div className="summary-card-content">
            <span>Rejected</span>
            <strong>{counts.rejected}</strong>
          </div>
        </div>

        <div className="request-summary-card cancelled-card">
          <div className="summary-card-icon">
            <span>↪</span>
          </div>

          <div className="summary-card-content">
            <span>Cancelled</span>
            <strong>{counts.cancelled}</strong>
          </div>
        </div>

      </div>

      {/* Loading */}
      {loading && requests.length === 0 && (
        <div className="requests-loading-state">
          <div className="loading-spinner"></div>

          <h2>Loading Requests</h2>

          <p>
            Please wait while we load your travel requests.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        requests.length === 0 &&
        !error && (
          <div className="requests-empty-state">

            <div className="requests-empty-icon">
              <span>✉</span>
            </div>

            <h2>No Requests Yet</h2>

            <p>
              You don't have any travel requests at the moment.
              New requests from tourists will appear here.
            </p>

            <button
              type="button"
              onClick={fetchRequests}
              className="empty-refresh-button"
            >
              Refresh Requests
            </button>

          </div>
        )}

      {/* Requests */}
      {!loading && requests.length > 0 && (
        <div className="requests-section">

          <div className="requests-section-header">
            <div>
              <h2>Recent Requests</h2>

              <p>
                {requests.length} request
                {requests.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="guide-requests-list">

            {requests.map((request) => {
              const tourist = request.tourist || {};
              const guide = request.guide || {};
              const experience = request.experience || {};

              const touristName =
                tourist.full_name ||
                tourist.name ||
                "Tourist";

              const experienceTitle =
                experience.title ||
                "General Tour";

              const status =
                request.status || "pending";

              const statusClass =
                getStatusClass(status);

              const isProcessing =
                actionLoading === request.id;

              return (
                <article
                  className="guide-request-card"
                  key={request.id}
                >

                  {/* Card Top */}
                  <div className="request-card-top">

                    <div className="request-id-wrapper">

                      <div className="request-icon">
                        <span>✦</span>
                      </div>

                      <div>
                        <span className="request-label">
                          TRAVEL REQUEST
                        </span>

                        <h3>
                          Request #{request.id}
                        </h3>
                      </div>

                    </div>

                    <span
                      className={`request-status ${statusClass}`}
                    >
                      <span className="status-dot"></span>

                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </span>

                  </div>

                  {/* Tourist */}
                  <div className="tourist-profile-row">

                    <div className="tourist-avatar">
                      {getTouristInitial(touristName)}
                    </div>

                    <div className="tourist-profile-text">

                      <span>REQUEST FROM</span>

                      <strong>
                        {touristName}
                      </strong>

                    </div>

                  </div>

                  {/* Details */}
                  <div className="guide-request-details">

                    <div className="request-detail-item">

                      <div className="detail-icon">
                        ◈
                      </div>

                      <div>
                        <span className="request-detail-label">
                          Tour / Experience
                        </span>

                        <strong>
                          {experienceTitle}
                        </strong>
                      </div>

                    </div>

                    <div className="request-detail-item">

                      <div className="detail-icon">
                        ◷
                      </div>

                      <div>
                        <span className="request-detail-label">
                          Travel Date
                        </span>

                        <strong>
                          {formatDate(
                            request.travel_date
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="request-detail-item">

                      <div className="detail-icon amount-icon">
                        ৳
                      </div>

                      <div>
                        <span className="request-detail-label">
                          Amount
                        </span>

                        <strong className="request-amount">
                          ৳
                          {Number(
                            request.amount || 0
                          ).toLocaleString()}
                        </strong>
                      </div>

                    </div>

                    <div className="request-detail-item">

                      <div className="detail-icon">
                        ♙
                      </div>

                      <div>
                        <span className="request-detail-label">
                          Guide
                        </span>

                        <strong>
                          {guide.company_name ||
                            "WonderHub"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* Request Details */}
                  {request.request_details && (
                    <div className="request-message">

                      <div className="message-header">

                        <span className="message-icon">
                          "
                        </span>

                        <span>
                          Request Details
                        </span>

                      </div>

                      <p>
                        {request.request_details}
                      </p>

                    </div>
                  )}

                  {/* Actions */}

                  {status === "pending" && (
                    <div className="guide-request-actions">

                      <button
                        type="button"
                        className="request-action-button reject"
                        disabled={isProcessing}
                        onClick={() =>
                          handleStatusChange(
                            request.id,
                            "reject"
                          )
                        }
                      >
                        <span>×</span>

                        {isProcessing
                          ? "Processing..."
                          : "Reject"}
                      </button>

                      <button
                        type="button"
                        className="request-action-button accept"
                        disabled={isProcessing}
                        onClick={() =>
                          handleStatusChange(
                            request.id,
                            "accept"
                          )
                        }
                      >
                        <span>✓</span>

                        {isProcessing
                          ? "Processing..."
                          : "Accept Request"}
                      </button>

                    </div>
                  )}

                  {/* Accepted */}
                  {status === "accepted" && (
                    <div className="guide-request-actions accepted-actions">

                      <button
                        type="button"
                        className="request-action-button cancel"
                        disabled={isProcessing}
                        onClick={() =>
                          handleStatusChange(
                            request.id,
                            "cancel"
                          )
                        }
                      >
                        <span>↪</span>

                        {isProcessing
                          ? "Processing..."
                          : "Cancel Request"}
                      </button>

                    </div>
                  )}

                  {/* Rejected */}
                  {status === "rejected" && (
                    <div className="request-final-state rejected-final">

                      <span>×</span>

                      This request has been rejected.

                    </div>
                  )}

                  {/* Cancelled */}
                  {status === "cancelled" && (
                    <div className="request-final-state cancelled-final">

                      <span>↪</span>

                      This request has been cancelled.

                    </div>
                  )}

                </article>
              );
            })}

          </div>
        </div>
      )}

    </section>
  );
};

export default GuideRequests;