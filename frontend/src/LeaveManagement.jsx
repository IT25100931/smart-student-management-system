import { useEffect, useState } from "react";
import "./LeaveManagement.css";

/* ---------- Small helpers ---------- */

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (isNaN(date)) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatLabel(value) {
  if (!value) return "—";
  const text = String(value).replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function leaveTypeLabel(type) {
  if (type === "FULL_DAY") return "Full day";
  if (type === "SHORT") return "Short leave";
  return formatLabel(type);
}

function SummaryCard({ title, period, remaining, total }) {
  const percent = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const isLow = total > 0 && percent <= 25;

  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <h3>{title}</h3>
        <span className="summary-period">{period}</span>
      </div>

      <p>
        {remaining}
        <span className="summary-total"> of {total}</span>
      </p>

      <div
        className={`summary-bar ${isLow ? "is-low" : ""}`}
        role="progressbar"
        aria-valuenow={remaining}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${title}: ${remaining} of ${total} remaining`}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function LeaveManagement() {
  const [summary, setSummary] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request form states
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [formData, setFormData] = useState({
    leaveType: "FULL_DAY",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    reason: ""
  });

  // Temporary test teacher.
  // Later this will come from the logged-in user.
  const staffId = 1;

  useEffect(() => {
    loadLeaveData();
  }, []);

  // Close the drawer with Escape and lock page scroll while it is open
  useEffect(() => {
    if (!showRequestForm) return;

    function onKeyDown(event) {
      if (event.key === "Escape" && !submitting) {
        cancelRequest();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showRequestForm, submitting]);

  async function loadLeaveData() {
    try {
      setLoading(true);
      setError("");

      const summaryResponse = await fetch(
        `http://localhost:8081/api/leave-requests/summary/${staffId}`
      );

      if (!summaryResponse.ok) {
        throw new Error("Could not load leave summary");
      }

      const summaryData = await summaryResponse.json();

      const requestsResponse = await fetch(
        `http://localhost:8081/api/leave-requests/staff/${staffId}`
      );

      if (!requestsResponse.ok) {
        throw new Error("Could not load leave requests");
      }

      const requestsData = await requestsResponse.json();

      setSummary(summaryData);
      setLeaveRequests(requestsData);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle changes to form fields
  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setFormError("");
    setFormSuccess("");
  }

  // Handle changing the leave type
  function handleLeaveTypeChange(event) {
    const newLeaveType = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      leaveType: newLeaveType,
      endDate:
        newLeaveType === "SHORT"
          ? previousData.startDate
          : previousData.endDate,
      startTime: newLeaveType === "FULL_DAY" ? "" : previousData.startTime,
      endTime: newLeaveType === "FULL_DAY" ? "" : previousData.endTime
    }));

    setFormError("");
    setFormSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setFormSuccess("");

    // Basic frontend validation
    if (!formData.startDate) {
      setFormError("Please select a start date.");
      return;
    }

    if (formData.leaveType === "FULL_DAY" && !formData.endDate) {
      setFormError("Please select an end date.");
      return;
    }

    if (formData.leaveType === "SHORT") {
      if (!formData.startTime || !formData.endTime) {
        setFormError("Please select both start time and end time.");
        return;
      }

      if (formData.endTime <= formData.startTime) {
        setFormError("End time must be after start time.");
        return;
      }
    }

    try {
      setSubmitting(true);

      // Prepare data for the backend
      const requestBody = {
        staff: {
          staffId: staffId
        },
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate:
          formData.leaveType === "SHORT"
            ? formData.startDate
            : formData.endDate,
        startTime:
          formData.leaveType === "SHORT"
            ? formData.startTime
            : null,
        endTime:
          formData.leaveType === "SHORT"
            ? formData.endTime
            : null,
        reason: formData.reason
      };

      const response = await fetch(
        "http://localhost:8081/api/leave-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Could not submit leave request."
        );
      }

      // Show success message
      setFormSuccess("Leave request submitted successfully.");

      // Reset form
      setFormData({
        leaveType: "FULL_DAY",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        reason: ""
      });

      // Refresh summary and request history
      await loadLeaveData();

    } catch (error) {
      console.error(error);
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function cancelRequest() {
    setShowRequestForm(false);
    setFormError("");
    setFormSuccess("");

    setFormData({
      leaveType: "FULL_DAY",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      reason: ""
    });
  }

  if (loading && !summary) {
    return (
      <div className="app">
        <div className="state-screen">
          <span className="spinner" aria-hidden="true" />
          <h2>Loading leave information...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="state-screen">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="submit-button" onClick={loadLeaveData}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      {/* Page header */}
      <header className="page-header">
        <div className="page-header-text">
          <h1>Leave Management</h1>
          <p className="page-subtitle">
            Check your balances, request time off and follow the status of
            your requests.
          </p>
        </div>

        <div className="request-button-section">
          <button
            className="request-leave-button"
            onClick={() => {
              setShowRequestForm(true);
              setFormSuccess("");
              setFormError("");
            }}
          >
            <span className="button-plus" aria-hidden="true">+</span>
            Request Leave
          </button>
        </div>
      </header>

      {/* Leave Summary */}
      <section className="summary-section" aria-label="Leave summary">
        <div className="summary-grid">

          <SummaryCard
            title="Full-day leave"
            period="This year"
            remaining={summary.fullDayRemaining}
            total={summary.fullDayTotal}
          />

          <SummaryCard
            title="Short leave"
            period="This year"
            remaining={summary.shortLeaveRemaining}
            total={summary.shortLeaveTotal}
          />

          <SummaryCard
            title="Full-day leave"
            period="This month"
            remaining={summary.monthlyFullDayRemaining}
            total={summary.monthlyFullDayTotal}
          />

          <SummaryCard
            title="Short leave"
            period="This month"
            remaining={summary.monthlyShortLeaveRemaining}
            total={summary.monthlyShortLeaveTotal}
          />

        </div>
      </section>

      {/* Main content: requests + upcoming */}
      <div className="content-grid">

        {/* Leave Requests */}
        <section className="requests-section">
          <div className="section-head">
            <h2>My Leave Requests</h2>
            <span className="count-pill">{leaveRequests.length}</span>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="empty-state">
              <p>No leave requests yet.</p>
              <span>Use “Request Leave” to submit your first one.</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request.leaveId}>
                      <td>
                        <span
                          className={`type-pill ${
                            request.leaveType === "SHORT" ? "is-short" : ""
                          }`}
                        >
                          {leaveTypeLabel(request.leaveType)}
                        </span>
                        {request.leaveType === "SHORT" &&
                          request.startTime &&
                          request.endTime && (
                            <span className="time-note">
                              {String(request.startTime).slice(0, 5)} –{" "}
                              {String(request.endTime).slice(0, 5)}
                            </span>
                          )}
                      </td>
                      <td>{formatDate(request.startDate)}</td>
                      <td>{formatDate(request.endDate)}</td>
                      <td className="reason-cell">{request.reason || "—"}</td>
                      <td>
                        <span
                          className={`status-badge status-${String(
                            request.status
                          ).toLowerCase()}`}
                        >
                          {formatLabel(request.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Upcoming Leave Days */}
        <aside className="upcoming-section">
          <div className="section-head">
            <h2>Upcoming Leave Days</h2>
          </div>

          {summary.upcomingLeaveDays.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming approved leave.</p>
            </div>
          ) : (
            <ul className="upcoming-list">
              {summary.upcomingLeaveDays.map((date) => {
                const parsed = new Date(`${date}T00:00:00`);
                const valid = !isNaN(parsed);

                return (
                  <li key={date} className="upcoming-item">
                    <div className="date-badge">
                      <span>
                        {valid
                          ? parsed.toLocaleDateString("en-GB", {
                              month: "short"
                            })
                          : ""}
                      </span>
                      <strong>{valid ? parsed.getDate() : date}</strong>
                    </div>

                    <div className="upcoming-text">
                      <p>
                        {valid
                          ? parsed.toLocaleDateString("en-GB", {
                              weekday: "long"
                            })
                          : date}
                      </p>
                      <span>{formatDate(date)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

      </div>

      {/* Request Leave Drawer */}
      {showRequestForm && (
        <div
          className="drawer-overlay"
          onClick={() => {
            if (!submitting) cancelRequest();
          }}
        >
          <section
            className="request-form-section"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-leave-title"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="drawer-head">
              <div>
                <h2 id="request-leave-title">Request Leave</h2>
                <p>Choose the type of leave and tell us when you need it.</p>
              </div>

              <button
                type="button"
                className="drawer-close"
                aria-label="Close"
                onClick={cancelRequest}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Leave Type */}
              <div className="form-group">
                <span className="field-label">Leave Type</span>

                <div className="leave-type-options">

                  <label>
                    <input
                      type="radio"
                      name="leaveType"
                      value="FULL_DAY"
                      checked={formData.leaveType === "FULL_DAY"}
                      onChange={handleLeaveTypeChange}
                    />
                    Full Day
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="leaveType"
                      value="SHORT"
                      checked={formData.leaveType === "SHORT"}
                      onChange={handleLeaveTypeChange}
                    />
                    Short Leave
                  </label>

                </div>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label htmlFor="startDate">
                  {formData.leaveType === "SHORT"
                    ? "Date"
                    : "Start Date"}
                </label>

                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                />
              </div>

              {/* End Date - Full Day only */}
              {formData.leaveType === "FULL_DAY" && (
                <div className="form-group">
                  <label htmlFor="endDate">
                    End Date
                  </label>

                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                  />
                </div>
              )}

              {/* Short Leave Times */}
              {formData.leaveType === "SHORT" && (
                <div className="time-row">

                  <div className="form-group">
                    <label htmlFor="startTime">
                      Start Time
                    </label>

                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">
                      End Time
                    </label>

                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleFormChange}
                    />
                  </div>

                </div>
              )}

              {/* Reason */}
              <div className="form-group">
                <label htmlFor="reason">
                  Reason
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  value={formData.reason}
                  onChange={handleFormChange}
                  placeholder="Enter the reason for your leave"
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              {/* Success */}
              {formSuccess && (
                <p className="form-success" role="status">
                  {formSuccess}
                </p>
              )}

              {/* Buttons */}
              <div className="form-buttons">

                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelRequest}
                  disabled={submitting}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        </div>
      )}

    </div>
  );
}

export default LeaveManagement;