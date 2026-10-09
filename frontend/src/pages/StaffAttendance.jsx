import { useState } from "react";

// Temporary sample data.
// Replace with a backend call once the attendanpm run dev
// ce endpoint exists.
const sampleAttendance = [
  {
    attendance_id: 1,
    staff_id: 101,
    status: "Present",
    check_in_time: "08:00:00",
    check_out_time: "16:00:00",
    remarks: "On time"
  },
  {
    attendance_id: 2,
    staff_id: 101,
    status: "Absent",
    check_in_time: "-",
    check_out_time: "-",
    remarks: "No reason provided"
  }
];

function StaffAttendance() {

  const [staffId, setStaffId] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState(
    "Enter a Staff ID to view attendance"
  );

  const handleAttendance = () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    const data = sampleAttendance.filter(
      (item) => item.staff_id.toString() === staffId.trim()
    );

    setAttendanceData(data);

    if (data.length === 0) {
      setMessage("No attendance records found for this Staff ID");
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
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              {attendanceData.length > 0 ? (

                attendanceData.map((attendance) => (

                  <tr key={attendance.attendance_id}>
                    <td>{attendance.attendance_id}</td>
                    <td>{attendance.staff_id}</td>
                    <td>
                      <span
                        className={
                          attendance.status.toLowerCase() === "present"
                            ? "status present"
                            : "status absent"
                        }
                      >
                        {attendance.status}
                      </span>
                    </td>
                    <td>{attendance.check_in_time}</td>
                    <td>{attendance.check_out_time}</td>
                    <td>{attendance.remarks}</td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6" className="no-data">
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
