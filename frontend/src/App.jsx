import { useState } from "react";
import StudentSearch from "./StudentSearch";
import LeaveManagement from "./LeaveManagement";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === "student") {
    return (
      <div>
        <button
          className="back-button"
          onClick={() => setCurrentPage("home")}
        >
          ← Back
        </button>

        <StudentSearch />
      </div>
    );
  }

  if (currentPage === "leave") {
    return (
      <div>
        <button
          className="back-button"
          onClick={() => setCurrentPage("home")}
        >
          ← Back
        </button>

        <LeaveManagement />
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Smart Student Management System</h1>
      <p>Select a service to continue</p>

      <div className="home-buttons">

        <button
          className="feature-button"
          onClick={() => setCurrentPage("student")}
        >
          Student Management
        </button>

        <button
          className="feature-button"
          onClick={() => setCurrentPage("leave")}
        >
          Leave Management
        </button>

      </div>
    </div>
  );
}

export default App;