import { useEffect, useState } from "react";
import "./App.css";

function App() {
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

  if (loading) {
    return <h2>Loading leave information...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">

      <h1>Leave Management</h1>

      {/* Leave Summary */}
      <section className="summary-section">
        <h2>Leave Summary</h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h3>Total Full-Day Leaves Remaining</h3>
            <p>
              {summary.fullDayRemaining} / {summary.fullDayTotal}
            </p>
          </div>

          <div className="summary-card">
            <h3>Total Short Leaves Remaining</h3>
            <p>
              {summary.shortLeaveRemaining} / {summary.shortLeaveTotal}
            </p>
          </div>

          <div className="summary-card">
            <h3>Full Days Remaining for This Month</h3>
            <p>
              {summary.monthlyFullDayRemaining} /{" "}
              {summary.monthlyFullDayTotal}
            </p>
          </div>

          <div className="summary-card">
            <h3>Short Leaves Remaining for This Month</h3>
            <p>
              {summary.monthlyShortLeaveRemaining} /{" "}
              {summary.monthlyShortLeaveTotal}
            </p>
          </div>

        </div>
      </section>

      {/* Request Leave Button */}
      <section className="request-button-section">
        {!showRequestForm && (
          <button
            className="request-leave-button"
            onClick={() => {
              setShowRequestForm(true);
              setFormSuccess("");
              setFormError("");
            }}
          >
            Request Leave
          </button>
        )}
      </section>

      {/* Request Leave Form */}
      {showRequestForm && (
        <section className="request-form-section">

          <h2>Request Leave</h2>

          <form onSubmit={handleSubmit}>

            {/* Leave Type */}
            <div className="form-group">
              <label>Leave Type</label>

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
              <p className="form-error">
                {formError}
              </p>
            )}

            {/* Success */}
            {formSuccess && (
              <p className="form-success">
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
      )}

      {/* Upcoming Leave Days */}
      <section className="upcoming-section">
        <h2>Upcoming Leave Days</h2>

        {summary.upcomingLeaveDays.length === 0 ? (
          <p>No upcoming approved leave.</p>
        ) : (
          summary.upcomingLeaveDays.map((date) => (
            <p key={date}>{date}</p>
          ))
        )}
      </section>

      {/* Leave Requests */}
      <section className="requests-section">
        <h2>My Leave Requests</h2>

        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
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
                  <td>{request.leaveType}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}

export default App;