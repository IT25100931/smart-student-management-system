import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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