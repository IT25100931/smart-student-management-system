import { useState } from "react";
import { API } from "../config";


function today() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function badgeClass(status) {
  if (status === "Not marked") {
    return "status notmarked";
  }
  return "status " + String(status).toLowerCase();
}

function AttendanceByDate() {

  const [date, setDate] = useState(today());
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState(
    "Choose a date to see all staff attendance"
  );

  const handleLoad = async () => {

    if (date === "") {
      alert("Please choose a date");
      return;
    }

    try {
      const response = await fetch(`${API}/attendance?date=${date}`);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setRecords(data);

      if (data.length === 0) {
        setMessage("No staff found");
      }

    } catch {
      setRecords([]);
      setMessage("Could not reach the backend. Is it running?");
    }
  };

  const count = (status) =>
    records.filter((r) => r.status === status).length;

  return (
    <>
      <header className="header">
        <h1>Daily Attendance</h1>
        <p>View all staff attendance for one date</p>
      </header>

      <section className="search-section">

        <label>Date</label>

        <div className="search-box">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={handleLoad} className="attendance-button">
            View Attendance
          </button>

        </div>

      </section>

      <section className="content-card">

        <div className="card-header">
          <h2>Attendance on {date}</h2>
          <p>
            {records.length > 0
              ? `${count("Present")} present, ${count("Absent")} absent, ` +
                `${count("Late")} late, ${count("Not marked")} not marked`
              : "All staff members and their status for the chosen date"}
          </p>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              {records.length > 0 ? (

                records.map((r) => (

                  <tr key={r.staffId}>
                    <td>{r.staffId}</td>
                    <td>{r.staffName}</td>
                    <td>
                      <span className={badgeClass(r.status)}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.remarks}</td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="4" className="no-data">
                    {message}
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>
    </>
  );
}

export default AttendanceByDate;
