import { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { ChevronLeftIcon, ChevronRightIcon } from "./NavIcons";
import TouristRequestCard from "./TouristRequestCard";
import RequestDetailsModal from "./RequestDetailsModal";
import { REQUEST_STATUS_OPTIONS } from "../mockRequestsBookings";

import "./RequestsBookings.css";

const PAGE_SIZE = 5;

// No mock data — this list starts empty and will be filled from the
// backend once the tourist is logged in and requests are fetched from the API.

export default function MyRequests({ onToast, onProceedToPayment }) {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [activeRequest, setActiveRequest] = useState(null);

  const filtered = useMemo(
    () =>
      statusFilter === "All Status"
        ? requests
        : requests.filter((r) => r.status === statusFilter),
    [requests, statusFilter]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const rangeStart =
    filtered.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const rangeEnd = Math.min(
    currentPage * PAGE_SIZE,
    filtered.length
  );

  const handleCancel = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "Cancelled" }
          : r
      )
    );

    onToast("Request cancelled.");
  };

  const handleProceedToPayment = (request) => {
    onProceedToPayment?.(request);
  };

  return (
    <section
      className="rb-panel"
      aria-label="My requests"
      id="my-requests"
    >
      <div className="rb-panel-header">
        <div className="rb-panel-title">
          <h2>My Requests</h2>

          <span className="rb-count-pill">
            {requests.length} Requests
          </span>
        </div>

        <label className="rb-filter">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter requests by status"
          >
            {REQUEST_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <FiChevronDown aria-hidden="true" />
        </label>
      </div>

      <div className="rb-col-header">
        <span>Guide Company</span>
        <span>Status</span>
        <span style={{ textAlign: "right" }}>
          Actions
        </span>
      </div>

      <div className="rb-list">
        {pageItems.length === 0 ? (
          <p className="rb-empty">
            No requests match this filter yet.
          </p>
        ) : (
          pageItems.map((request) => (
            <TouristRequestCard
              key={request.id}
              request={request}
              onViewDetails={setActiveRequest}
              onCancel={handleCancel}
              onProceedToPayment={handleProceedToPayment}
            />
          ))
        )}
      </div>

      <div className="rb-footer">
        <span className="rb-footer-text">
          Showing {rangeStart} to {rangeEnd} of{" "}
          {filtered.length} requests
        </span>

        <div className="rb-pager">
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon width={14} height={14} />
          </button>

          <button
            type="button"
            className="active"
          >
            {currentPage}
          </button>

          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRightIcon width={14} height={14} />
          </button>
        </div>
      </div>

      {activeRequest && (
        <RequestDetailsModal
          kind="request"
          item={activeRequest}
          onClose={() => setActiveRequest(null)}
          onCancel={handleCancel}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
    </section>
  );
}