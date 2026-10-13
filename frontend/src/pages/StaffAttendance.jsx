import { useState } from "react";
import { API } from "../config";


function StaffAttendance() {

  const [staffId, setStaffId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState(
    "Enter a Staff ID to view attendance"
  );

  const handleAttendance = async () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    try {
      const response = await fetch(`${API}/${staffId.trim()}/attendance`);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setAttendanceData(data);

      if (data.length === 0) {
        setMessage("No attendance records found for this Staff ID");
      }

    } catch {
      setAttendanceData([]);
      setMessage("Could not reach the backend. Is it running?");
    }
  };

  return (
    <>
      <header className="header">
        <h1>Staff Attendance</h1>
        <p>View academic staff attendance records</p>
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

          <button onClick={handleAttendance} className="attendance-button">
            View Attendance
          </button>

        </div>

      </section>

      <section className="content-card">

        <div className="card-header">
          <h2>Attendance Records</h2>
          <p>Daily attendance history</p>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Attendance ID</th>
                <th>Staff ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              {attendanceData.length > 0 ? (

                attendanceData.map((a) => (

                  <tr key={a.attendanceId}>
                    <td>{a.attendanceId}</td>
                    <td>{a.staffId}</td>
                    <td>{a.attendanceDate}</td>
                    <td>
                      <span
                        className={
                          "status " + String(a.status).toLowerCase()
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>{a.checkInTime}</td>
                    <td>{a.checkOutTime}</td>
                    <td>{a.remarks}</td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="7" className="no-data">
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

export default StaffAttendance;
