import { useEffect, useMemo, useState } from "react";

import { FiInbox } from "react-icons/fi";

import { ChevronLeftIcon, ChevronRightIcon } from "./NavIcons";

import TouristRequestCard from "./TouristRequestCard";

import RequestDetailsModal from "./RequestDetailsModal";

import "./RequestsBookings.css";

const PAGE_SIZE = 5;

export default function MyRequests({
  onToast,
  onProceedToPayment,
}) {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get authentication token
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token")
    );
  };

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/bookings",
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
            data?.message || "Failed to load bookings."
          );
        }

        if (Array.isArray(data?.bookings)) {
          setRequests(data.bookings);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);

        setError(
          err?.message ||
            "Something went wrong while loading bookings."
        );

        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(requests.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = currentPage * PAGE_SIZE;

    return requests.slice(start, end);
  }, [requests, currentPage]);

  const rangeStart =
    requests.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const rangeEnd = Math.min(
    currentPage * PAGE_SIZE,
    requests.length
  );

  // Pay Now
  const handleProceedToPayment = (booking) => {
    if (!booking?.id) {
      onToast?.("Booking ID not found.");
      return;
    }

    onProceedToPayment?.(booking);
  };

  // Cancel
  const handleCancel = (id) => {
    onToast?.(
      "Cancellation is currently handled by the backend."
    );
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="rb-panel"
        aria-label="My requests"
        id="my-requests"
      >
        <div className="rb-panel-header">
          <div className="rb-panel-title">
            <h2>My Requests</h2>
          </div>
        </div>

        <div className="rb-list">
          <div className="rb-empty-state">
            <div className="rb-empty-icon">
              <FiInbox aria-hidden="true" />
            </div>

            <h3>Loading your requests...</h3>

            <p>
              Please wait while we fetch your bookings.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className="rb-panel"
        aria-label="My requests"
        id="my-requests"
      >
        <div className="rb-panel-header">
          <div className="rb-panel-title">
            <h2>My Requests</h2>
          </div>
        </div>

        <div className="rb-list">
          <div className="rb-empty-state">
            <div className="rb-empty-icon">
              <FiInbox aria-hidden="true" />
            </div>

            <h3>Unable to load requests</h3>

            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="rb-panel"
      aria-label="My requests"
      id="my-requests"
    >
      {/* Header */}
      <div className="rb-panel-header">
        <div className="rb-panel-title">
          <h2>My Requests</h2>

          <span className="rb-count-pill">
            {requests.length} Requests
          </span>
        </div>
      </div>

      {/* Column Header */}
      <div className="rb-col-header">
        <span>Guide / Guide Company</span>

        <span>Tour / Experience</span>

        <span>Date</span>

        <span>Status</span>

        <span style={{ textAlign: "right" }}>
          Action
        </span>
      </div>

      {/* Requests */}
      <div className="rb-list">
        {pageItems.length === 0 ? (
          <div className="rb-empty-state">
            <div className="rb-empty-icon">
              <FiInbox aria-hidden="true" />
            </div>

            <h3>No booking requests yet</h3>

            <p>
              Once a guide accepts your request,
              your booking will appear here.
            </p>
          </div>
        ) : (
          pageItems.map((booking) => (
            <TouristRequestCard
              key={booking.id}
              request={booking}
              onViewDetails={setActiveRequest}
              onCancel={handleCancel}
              onProceedToPayment={
                handleProceedToPayment
              }
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="rb-footer">
        <span className="rb-footer-text">
          Showing {rangeStart} to {rangeEnd} of{" "}
          {requests.length} requests
        </span>

        <div className="rb-pager">
          <button
            type="button"
            onClick={() => {
              setPage((previousPage) =>
                Math.max(1, previousPage - 1)
              );
            }}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon
              width={14}
              height={14}
            />
          </button>

          <button
            type="button"
            className="active"
          >
            {currentPage}
          </button>

          <button
            type="button"
            onClick={() => {
              setPage((previousPage) =>
                Math.min(
                  totalPages,
                  previousPage + 1
                )
              );
            }}
            disabled={
              currentPage === totalPages
            }
            aria-label="Next page"
          >
            <ChevronRightIcon
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {activeRequest && (
        <RequestDetailsModal
          kind="request"
          item={activeRequest}
          onClose={() => {
            setActiveRequest(null);
          }}
          onCancel={handleCancel}
          onProceedToPayment={
            handleProceedToPayment
          }
        />
      )}
    </section>
  );
}