import { useState } from "react";
import { API } from "../config";


function today() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function MarkAttendance() {

  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(today());
  const [status, setStatus] = useState("Present");
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {

    if (staffId.trim() === "" || isNaN(Number(staffId))) {
      setResult({ type: "error", text: "Please enter a valid Staff ID" });
      return;
    }

    if (date === "") {
      setResult({ type: "error", text: "Please choose a date" });
      return;
    }

    try {
      const response = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: Number(staffId),
          attendanceDate: date,
          status: status,
          remarks: remarks
        })
      });

      const data = await response.json();

      setResult({
        type: response.ok ? "success" : "error",
        text: data.message
      });

      if (response.ok) {
        setRemarks("");
      }

    } catch {
      setResult({
        type: "error",
        text: "Could not reach the backend. Is it running?"
      });
    }
  };

  return (
    <>
      <header className="header">
        <h1>Mark Attendance</h1>
        <p>Record Present, Absent or Late for a staff member</p>
      </header>

      <section className="search-section">

        <label>Staff ID</label>

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          />

        </div>

        <label style={{ marginTop: 16 }}>Date</label>

        <div className="search-box">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

        </div>

        <label style={{ marginTop: 16 }}>Status</label>

        <div className="search-box">

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

        </div>

        <label style={{ marginTop: 16 }}>Remarks</label>

        <div className="search-box">

          <input
            type="text"
            placeholder="Optional, e.g. On time, Sick leave"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button onClick={handleSubmit} className="attendance-button">
            Save Attendance
          </button>

        </div>

        {result && (
          <div className={"form-message " + result.type}>
            {result.text}
          </div>
        )}

      </section>
    </>
  );
}

export default MarkAttendance;
