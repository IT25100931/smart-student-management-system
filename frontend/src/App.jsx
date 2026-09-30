import React, { useState } from "react";
import "./AcademicStaffManagement.css";

function AcademicStaffManagement() {

  const [staffId, setStaffId] = useState("");
  const [activePage, setActivePage] = useState("salary");

  const [salaryData, setSalaryData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  // Temporary sample data
  // Later this will come from your Java backend
  const sampleSalary = [
    {
      salary_id: 1,
      staff_id: 101,
      salary_month: 9,
      salary_year: 2026,
      base_salary: 50000,
      allowances: 5000,
      deductions: 2000,
      net_salary: 53000,
      payment_date: "2026-09-30",
      payment_status: "PAID"
    }
  ];

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


  const handleSalary = () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    // Temporary sample data
    // Replace this with backend API call
    const data = sampleSalary.filter(
        item => item.staff_id.toString() === staffId
    );

    setSalaryData(data);
    setActivePage("salary");
  };


  const handleAttendance = () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    // Temporary sample data
    // Replace this with backend API call
    const data = sampleAttendance.filter(
        item => item.staff_id.toString() === staffId
    );

    setAttendanceData(data);
    setActivePage("attendance");
  };


  return (
      <div className="dashboard">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="logo">
            <h2>Focus School</h2>
            <p>Staff Management</p>
          </div>

          <div className="menu">

            <button
                className={activePage === "salary" ? "active" : ""}
                onClick={() => setActivePage("salary")}
            >
              💰 Salary Details
            </button>

            <button
                className={activePage === "attendance" ? "active" : ""}
                onClick={() => setActivePage("attendance")}
            >
              📅 Staff Attendance
            </button>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <main className="main-content">

          <header className="header">

            <div>
              <h1>Academic Staff Management</h1>
              <p>
                View salary and attendance information
              </p>
            </div>

          </header>


          {/* STAFF ID SEARCH */}

          <section className="search-section">

            <label>Staff ID</label>

            <div className="search-box">

              <input
                  type="text"
                  placeholder="Enter Staff ID"
                  value={staffId}
                  onChange={(e) =>
                      setStaffId(e.target.value)
                  }
              />

              <button
                  onClick={handleSalary}
                  className="salary-button"
              >
                View Salary
              </button>

              <button
                  onClick={handleAttendance}
                  className="attendance-button"
              >
                View Attendance
              </button>

            </div>

          </section>


          {/* SALARY PAGE */}

          {activePage === "salary" && (

              <section className="content-card">

                <div className="card-header">

                  <div>
                    <h2>Salary Details</h2>
                    <p>
                      Academic staff salary records
                    </p>
                  </div>

                </div>


                <div className="table-container">

                  <table>

                    <thead>

                    <tr>
                      <th>Salary ID</th>
                      <th>Staff ID</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Base Salary</th>
                      <th>Allowances</th>
                      <th>Deductions</th>
                      <th>Net Salary</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                    </tr>

                    </thead>

                    <tbody>

                    {salaryData.length > 0 ? (

                        salaryData.map((salary) => (

                            <tr key={salary.salary_id}>

                              <td>
                                {salary.salary_id}
                              </td>

                              <td>
                                {salary.staff_id}
                              </td>

                              <td>
                                {salary.salary_month}
                              </td>

                              <td>
                                {salary.salary_year}
                              </td>

                              <td>
                                Rs. {salary.base_salary}
                              </td>

                              <td>
                                Rs. {salary.allowances}
                              </td>

                              <td>
                                Rs. {salary.deductions}
                              </td>

                              <td className="net-salary">
                                Rs. {salary.net_salary}
                              </td>

                              <td>
                                {salary.payment_date}
                              </td>

                              <td>

                                                <span className="status paid">
                                                    {salary.payment_status}
                                                </span>

                              </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                          <td
                              colSpan="10"
                              className="no-data"
                          >
                            Enter a Staff ID to view salary
                            details
                          </td>

                        </tr>

                    )}

                    </tbody>

                  </table>

                </div>

              </section>

          )}


          {/* ATTENDANCE PAGE */}

          {activePage === "attendance" && (

              <section className="content-card">

                <div className="card-header">

                  <div>
                    <h2>Staff Attendance</h2>
                    <p>
                      Academic staff attendance records
                    </p>
                  </div>

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

                            <tr
                                key={
                                  attendance.attendance_id
                                }
                            >

                              <td>
                                {
                                  attendance.attendance_id
                                }
                              </td>

                              <td>
                                {attendance.staff_id}
                              </td>

                              <td>

                                                <span
                                                    className={
                                                      attendance.status
                                                          .toLowerCase() === "present"
                                                          ? "status present"
                                                          : "status absent"
                                                    }
                                                >
                                                    {attendance.status}
                                                </span>

                              </td>

                              <td>
                                {
                                  attendance.check_in_time
                                }
                              </td>

                              <td>
                                {
                                  attendance.check_out_time
                                }
                              </td>

                              <td>
                                {attendance.remarks}
                              </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                          <td
                              colSpan="6"
                              className="no-data"
                          >
                            Enter a Staff ID to view
                            attendance
                          </td>

                        </tr>

                    )}

                    </tbody>

                  </table>

                </div>

              </section>

          )}

        </main>

      </div>
  );
}

export default AcademicStaffManagement;