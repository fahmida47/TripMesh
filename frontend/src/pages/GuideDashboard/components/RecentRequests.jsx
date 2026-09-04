import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RecentRequests.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const RecentRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
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
          data?.error ||
            data?.message ||
            "Failed to fetch requests."
        );
      }

      console.log("Dashboard Requests:", data);

      const requestList = Array.isArray(data?.requests)
        ? data.requests
        : [];

      const sortedRequests = [...requestList].sort(
        (a, b) => {
          const dateA = new Date(
            a?.created_at || 0
          ).getTime();

          const dateB = new Date(
            b?.created_at || 0
          ).getTime();

          return dateB - dateA;
        }
      );

      setRequests(sortedRequests.slice(0, 3));
    } catch (err) {
      console.error(
        "Recent requests error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load requests."
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const handleViewAll = () => {
    navigate("/guide-dashboard/requests");
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

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

  const getTouristName = (request) => {
    const tourist = request?.tourist || {};

    return (
      tourist.full_name ||
      tourist.name ||
      tourist.fullName ||
      "Tourist"
    );
  };

  const getTouristInitial = (request) => {
    const name = getTouristName(request);

    return name.charAt(0).toUpperCase();
  };

  const getExperienceTitle = (request) => {
    const experience =
      request?.experience || {};

    return (
      experience.title ||
      experience.name ||
      experience.experience_name ||
      request?.tour_title ||
      request?.tour_name ||
      "General Tour"
    );
  };

  const getStatus = (request) => {
    return request?.status || "pending";
  };

  return (
    <section className="recent-requests-card">
      <div className="recent-requests-header">
        <div>
          <h3>Requests</h3>

          {!loading &&
            !error &&
            requests.length > 0 && (
              <span className="recent-requests-count">
                Latest Requests
              </span>
            )}
        </div>

        <button
          type="button"
          className="requests-view-all-btn"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {loading && (
        <div className="recent-requests-empty">
          <p>Loading requests...</p>
          <span>
            Please wait while we load the latest
            requests.
          </span>
        </div>
      )}

      {!loading && error && (
        <div className="recent-requests-empty">
          <p>Unable to load requests</p>
          <span>{error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="recent-requests-empty">
            <p>No requests yet</p>
            <span>
              New travel requests from tourists
              will appear here.
            </span>
          </div>
        )}

      {!loading &&
        !error &&
        requests.length > 0 && (
          <div className="recent-requests-list">
            {requests.map((request) => {
              const touristName =
                getTouristName(request);

              const experienceTitle =
                getExperienceTitle(request);

              const status =
                getStatus(request);

              return (
                <div
                  className="recent-request-item"
                  key={request.id}
                >
                  <div className="recent-request-avatar">
                    {getTouristInitial(request)}
                  </div>

                  <div className="recent-request-info">
                    <div className="recent-request-top">
                      <strong>
                        {touristName}
                      </strong>

                      <span
                        className={`recent-request-status ${status.toLowerCase()}`}
                      >
                        {status
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )}
                      </span>
                    </div>

                    <span className="recent-request-tour">
                      {experienceTitle}
                    </span>

                    <span className="recent-request-date">
                      {formatDate(
                        request.travel_date
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
};

export default RecentRequests;