import { useState } from "react";
import { API } from "../config";


function money(value) {
  return "Rs. " + Number(value).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function SalaryCalculation() {

  const [staffId, setStaffId] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(
    "Enter a Staff ID to calculate the net salary"
  );

  const handleCalculate = async () => {

    if (staffId.trim() === "") {
      alert("Please enter Staff ID");
      return;
    }

    try {
      const response = await fetch(
        `${API}/${staffId.trim()}/salary/calculate`
      );

      if (response.status === 404) {
        setResult(null);
        setMessage("Staff member not found");
        return;
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setResult(await response.json());

    } catch {
      setResult(null);
      setMessage("Could not reach the backend. Is it running?");
    }
  };

  return (
    <>
      <header className="header">
        <h1>Salary Calculation</h1>
        <p>Calculate a staff member's net salary</p>
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

          <button onClick={handleCalculate} className="salary-button">
            Calculate
          </button>

        </div>

      </section>

      <section className="content-card">

        <div className="card-header">
          <h2>Net Salary</h2>
          <p>Base salary + allowances - deductions</p>
        </div>

        {result ? (
          <>
            <h3 className="calc-name">
              {result.staffName} (ID {result.staffId})
            </h3>

            <table className="calc-table">
              <tbody>
                <tr>
                  <td>Base salary</td>
                  <td>{money(result.baseSalary)}</td>
                </tr>
                <tr>
                  <td>Allowances ({result.allowancePercent}%)</td>
                  <td>+ {money(result.allowances)}</td>
                </tr>
                <tr>
                  <td>Deductions ({result.deductionPercent}%)</td>
                  <td>- {money(result.deductions)}</td>
                </tr>
                <tr className="calc-total">
                  <td>Net salary</td>
                  <td>{money(result.netSalary)}</td>
                </tr>
              </tbody>
            </table>

            <p className="calc-note">
              Allowances and deductions are fixed percentages of the base
              salary.
            </p>
          </>
        ) : (
          <p className="no-data">{message}</p>
        )}

      </section>
    </>
  );
}

export default SalaryCalculation;
