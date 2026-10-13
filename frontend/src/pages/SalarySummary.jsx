import { useState } from "react";
import { API } from "../config";


const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function money(value) {
  return "Rs. " + Number(value).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function SalarySummary() {

  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState(
    "Choose a month and year to see the salary summary"
  );

  const handleSummary = async () => {

    if (year.trim() === "" || isNaN(Number(year))) {
      alert("Please enter a valid year");
      return;
    }

    try {
      const response = await fetch(
        `${API}/salary/summary?month=${month}&year=${year.trim()}`
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      if (data.totalRecords === 0) {
        setSummary(null);
        setMessage(
          `No salary records found for ${MONTHS[month - 1]} ${year.trim()}`
        );
        return;
      }

      setSummary(data);

    } catch {
      setSummary(null);
      setMessage("Could not reach the backend. Is it running?");
    }
  };

  return (
    <>
      <header className="header">
        <h1>Monthly Salary Summary</h1>
        <p>Total paid and total pending salaries for a month</p>
      </header>

      <section className="search-section">

        <label>Month and year</label>

        <div className="search-box">

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button onClick={handleSummary} className="salary-button">
            Show Summary
          </button>

        </div>

      </section>

      <section className="content-card">

        <div className="card-header">
          <h2>
            {summary
              ? `${MONTHS[summary.month - 1]} ${summary.year}`
              : "Summary"}
          </h2>
          <p>Paid = payment status PAID. Pending = all other records.</p>
        </div>

        {summary ? (
          <div className="summary-cards">

            <div className="summary-card paid">
              <p>Total paid</p>
              <h3>{money(summary.paidTotal)}</h3>
              <span>{summary.paidCount} staff paid</span>
            </div>

            <div className="summary-card pending">
              <p>Total pending</p>
              <h3>{money(summary.pendingTotal)}</h3>
              <span>{summary.pendingCount} staff pending</span>
            </div>

            <div className="summary-card">
              <p>Grand total</p>
              <h3>{money(summary.grandTotal)}</h3>
              <span>{summary.totalRecords} salary records</span>
            </div>

          </div>
        ) : (
          <p className="no-data">{message}</p>
        )}

      </section>
    </>
  );
}

export default SalarySummary;
