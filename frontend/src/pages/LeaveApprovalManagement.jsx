import { useCallback, useEffect, useMemo, useState } from "react";
import "./LeaveApprovalManagement.css";

const API_URL = "http://localhost:8081/api/leave-requests";

// Temporary development value.
// Replace with a valid existing Staff ID in your local database.
// Later, this should come from the authenticated administrator session.
const APPROVER_STAFF_ID = 2;

const FILTERS = [
  { id: "ALL", label: "All requests" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

async function readResponse(response) {
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
        typeof data === "object" && data !== null
            ? data.message || data.error
            : data;

    if (response.status === 401 || response.status === 403) {
      throw new Error(
          "The server denied this request. Authenticated admin access " +
          "must be connected before this operation can be completed."
      );
    }

    throw new Error(message || `Request failed: ${response.status}`);
  }

  return data;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "";

  const parts = value.split(":");

  if (parts.length < 2) return value;

  const date = new Date();
  date.setHours(Number(parts[0]), Number(parts[1]), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStaffLabel(request) {
  const staff = request.staff;

  if (staff) {
    const name = [
      staff.firstName || staff.firstname,
      staff.lastName || staff.lastname,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    if (name) return name;

    if (staff.staffId != null) {
      return `Staff #${staff.staffId}`;
    }
  }

  if (request.staffId != null) {
    return `Staff #${request.staffId}`;
  }

  return "Staff details unavailable";
}

function formatLeaveType(value) {
  if (value === "FULL_DAY") return "Full-day leave";
  if (value === "SHORT") return "Short leave";

  return value || "Leave";
}

function formatStatus(value) {
  if (!value) return "Unknown";

  return value.charAt(0) + value.slice(1).toLowerCase();
}

function LeaveApprovalManagement() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await readResponse(response);

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setRequests([]);
      setError(
          err.message ||
          "Unable to load leave requests. Check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter(
          (request) => request.status === "PENDING"
      ).length,
      approved: requests.filter(
          (request) => request.status === "APPROVED"
      ).length,
      rejected: requests.filter(
          (request) => request.status === "REJECTED"
      ).length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests
        .filter((request) => {
          const matchesStatus =
              filter === "ALL" || request.status === filter;

          const searchableText = [
            request.leaveId,
            request.leaveType,
            request.status,
            request.reason,
            getStaffLabel(request),
            request.startDate,
            request.endDate,
          ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return matchesStatus && searchableText.includes(query);
        })
        .sort((a, b) => {
          const statusOrder = {
            PENDING: 0,
            APPROVED: 1,
            REJECTED: 2,
          };

          const difference =
              (statusOrder[a.status] ?? 3) -
              (statusOrder[b.status] ?? 3);

          if (difference !== 0) return difference;

          return String(b.appliedAt || "").localeCompare(
              String(a.appliedAt || "")
          );
        });
  }, [requests, filter, search]);

  async function handleDecision(request, decision) {
    if (request.status !== "PENDING") {
      return;
    }

    const isApproval = decision === "approve";
    const actionLabel = isApproval ? "approve" : "reject";

    const confirmed = window.confirm(
        `Are you sure you want to ${actionLabel} leave request #${request.leaveId} ` +
        `from ${getStaffLabel(request)}?`
    );

    if (!confirmed) return;

    setProcessingId(request.leaveId);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const url =
          `${API_URL}/${request.leaveId}/${decision}` +
          `?approvedBy=${APPROVER_STAFF_ID}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      await readResponse(response);

      await loadRequests();

      setMessage(
          `Leave request #${request.leaveId} was ${isApproval ? "approved" : "rejected"}.`
      );
    } catch (err) {
      setError(
          err.message || `Unable to ${actionLabel} this leave request.`
      );
    } finally {
      setProcessingId(null);
    }
  }

  function renderRequestDetails(request) {
    if (request.leaveType === "SHORT") {
      return (
          <div className="admin-leave-request-dates">
            <span>{formatDate(request.startDate)}</span>

            <span className="admin-leave-time-range">
            {formatTime(request.startTime) || "Start time unavailable"}
              {" – "}
              {formatTime(request.endTime) || "End time unavailable"}
          </span>
          </div>
      );
    }

    return (
        <div className="admin-leave-request-dates">
        <span>
          {formatDate(request.startDate)}
          {request.endDate &&
          request.endDate !== request.startDate
              ? ` – ${formatDate(request.endDate)}`
              : ""}
        </span>

          {Number(request.totalDays) > 0 && (
              <span className="admin-leave-duration">
            {request.totalDays}{" "}
                {Number(request.totalDays) === 1 ? "day" : "days"}
          </span>
          )}
        </div>
    );
  }

  function renderActionButtons(request) {
    if (request.status !== "PENDING") {
      return (
          <span className="admin-leave-action-completed">
          No action needed
        </span>
      );
    }

    const isProcessing = processingId === request.leaveId;

    return (
        <div className="admin-leave-actions">
          <button
              type="button"
              className="admin-leave-approve-button"
              onClick={() => handleDecision(request, "approve")}
              disabled={processingId !== null}
          >
            {isProcessing ? "Processing..." : "Approve"}
          </button>

          <button
              type="button"
              className="admin-leave-reject-button"
              onClick={() => handleDecision(request, "reject")}
              disabled={processingId !== null}
          >
            {isProcessing ? "Please wait" : "Reject"}
          </button>
        </div>
    );
  }

  return (
      <section className="admin-leave-page">
        <header className="admin-leave-header">
          <div>
            <p className="admin-leave-eyebrow">
              ADMINISTRATION / STAFF SERVICES
            </p>

            <h2>Leave Approvals</h2>

            <p>
              Review academic staff leave requests and record
              approval decisions.
            </p>
          </div>

          <button
              type="button"
              className="admin-leave-refresh"
              onClick={loadRequests}
              disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh requests"}
          </button>
        </header>

        {error && (
            <div className="admin-leave-message is-error" role="alert">
              <strong>Unable to complete the request</strong>
              <p>{error}</p>
            </div>
        )}

        {message && (
            <div className="admin-leave-message is-success" role="status">
              {message}
            </div>
        )}

        <div className="admin-leave-summary-grid">
          <article className="admin-leave-summary-card">
          <span className="admin-leave-summary-label">
            All requests
          </span>
            <strong>{loading ? "—" : counts.all}</strong>
            <span className="admin-leave-summary-caption">
            Recorded leave requests
          </span>
          </article>

          <article className="admin-leave-summary-card is-pending">
          <span className="admin-leave-summary-label">
            Pending review
          </span>
            <strong>{loading ? "—" : counts.pending}</strong>
            <span className="admin-leave-summary-caption">
            Awaiting a decision
          </span>
          </article>

          <article className="admin-leave-summary-card is-approved">
          <span className="admin-leave-summary-label">
            Approved
          </span>
            <strong>{loading ? "—" : counts.approved}</strong>
            <span className="admin-leave-summary-caption">
            Approved requests
          </span>
          </article>

          <article className="admin-leave-summary-card is-rejected">
          <span className="admin-leave-summary-label">
            Rejected
          </span>
            <strong>{loading ? "—" : counts.rejected}</strong>
            <span className="admin-leave-summary-caption">
            Rejected requests
          </span>
          </article>
        </div>

        <section className="admin-leave-list-panel">
          <div className="admin-leave-list-heading">
            <div>
              <h3>Staff leave requests</h3>
              <p>
                Select a pending request to approve or reject it.
              </p>
            </div>

            <span className="admin-leave-total-badge">
            {filteredRequests.length} shown
          </span>
          </div>

          <div className="admin-leave-toolbar">
            <div
                className="admin-leave-filter-tabs"
                role="group"
                aria-label="Filter by leave request status"
            >
              {FILTERS.map((item) => (
                  <button
                      type="button"
                      key={item.id}
                      className={
                        filter === item.id ? "is-active" : ""
                      }
                      onClick={() => setFilter(item.id)}
                      aria-pressed={filter === item.id}
                  >
                    {item.label}

                    <span>
                  {item.id === "ALL"
                      ? counts.all
                      : counts[item.id.toLowerCase()]}
                </span>
                  </button>
              ))}
            </div>

            <label className="admin-leave-search">
            <span className="admin-leave-search-symbol" aria-hidden="true">
              ⌕
            </span>

              <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search staff or requests..."
                  aria-label="Search leave requests"
              />
            </label>
          </div>

          {loading ? (
              <p className="admin-leave-empty">Loading leave requests...</p>
          ) : requests.length === 0 && !error ? (
              <p className="admin-leave-empty">
                No leave requests were returned by the server.
              </p>
          ) : filteredRequests.length === 0 ? (
              <p className="admin-leave-empty">
                No requests match the current filter and search.
              </p>
          ) : (
              <div className="admin-leave-table-wrapper">
                <table className="admin-leave-table">
                  <thead>
                  <tr>
                    <th>Staff member</th>
                    <th>Leave details</th>
                    <th>Reason</th>
                    <th>Applied on</th>
                    <th>Status</th>
                    <th>Decision</th>
                  </tr>
                  </thead>

                  <tbody>
                  {filteredRequests.map((request) => (
                      <tr key={request.leaveId}>
                        <td>
                          <div className="admin-leave-staff">
                        <span className="admin-leave-staff-avatar">
                          {getStaffLabel(request)
                              .replace("Staff #", "S")
                              .slice(0, 2)
                              .toUpperCase()}
                        </span>

                            <div>
                              <strong>{getStaffLabel(request)}</strong>
                              <small>Request #{request.leaveId}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-leave-type">
                            {formatLeaveType(request.leaveType)}
                          </div>

                          {renderRequestDetails(request)}
                        </td>

                        <td>
                          <div className="admin-leave-reason">
                            {request.reason || "No reason supplied"}
                          </div>
                        </td>

                        <td className="admin-leave-applied-date">
                          {formatDateTime(request.appliedAt)}
                        </td>

                        <td>
                      <span
                          className={`admin-leave-status status-${String(
                              request.status || "unknown"
                          ).toLowerCase()}`}
                      >
                        <span />
                        {formatStatus(request.status)}
                      </span>
                        </td>

                        <td>{renderActionButtons(request)}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>

        <p className="admin-leave-footnote">
          Decisions are sent to the backend. A request changes status
          only when the server accepts the operation.
        </p>
      </section>
  );
}

export default LeaveApprovalManagement;