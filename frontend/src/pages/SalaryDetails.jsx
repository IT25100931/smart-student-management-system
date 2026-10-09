import { useState } from "react";

const API = "http://localhost:8081/api/staff";

function SalaryDetails() {

  const [staffId, setStaffId] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [message, setMessage] = useState(
    "Enter a Staff ID to view salary details"
  );

  const handleSalary = async () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    try {
      const response = await fetch(`${API}/${staffId.trim()}/salary`);

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      // The backend sends camelCase names; the table uses snake_case
      const rows = data.map((s) => ({
        salary_id: s.salaryId,
        staff_id: s.staffId,
        salary_month: s.salaryMonth,
        salary_year: s.salaryYear,
        base_salary: s.baseSalary,
        allowances: s.allowances,
        deductions: s.deductions,
        net_salary: s.netSalary,
        payment_date: s.paymentDate,
        payment_status: s.paymentStatus
      }));

      setSalaryData(rows);

      if (rows.length === 0) {
        setMessage("No salary records found for this Staff ID");
      }

    } catch (error) {
      setSalaryData([]);
      setMessage("Could not reach the backend. Is it running on port 8080?");
    }
  };

  return (
    <>
      <header className="header">
        <h1>Salary Details</h1>
        <p>View academic staff salary records</p>
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

          <button onClick={handleSalary} className="salary-button">
            View Salary
          </button>

        </div>

      </section>

      <section className="content-card">

        <div className="card-header">
          <h2>Salary Records</h2>
          <p>Monthly salary history, newest first</p>
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
                    <td>{salary.salary_id}</td>
                    <td>{salary.staff_id}</td>
                    <td>{salary.salary_month}</td>
                    <td>{salary.salary_year}</td>
                    <td>Rs. {salary.base_salary}</td>
                    <td>Rs. {salary.allowances}</td>
                    <td>Rs. {salary.deductions}</td>
                    <td className="net-salary">Rs. {salary.net_salary}</td>
                    <td>{salary.payment_date}</td>
                    <td>
                      <span
                        className={
                          "status " +
                          String(salary.payment_status).toLowerCase()
                        }
                      >
                        {salary.payment_status}
                      </span>
                    </td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="10" className="no-data">
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

export default SalaryDetails;
