import { NavLink, Outlet, useNavigate } from "react-router-dom";

function StaffLayout() {
  const navigate = useNavigate();

  return (
    <div className="staff-module">
      <div className="dashboard">

        <aside className="sidebar">

          <div className="logo">
            <h2>Focus School</h2>
            <p>Staff Management</p>
          </div>

          <nav className="menu">
            <NavLink to="/staff/salary">Salary Details</NavLink>
            <NavLink to="/staff/salary-calculation">Salary Calculation</NavLink>
            <NavLink to="/staff/salary-summary">Salary Summary</NavLink>
            <NavLink to="/staff/attendance">Staff Attendance</NavLink>
            <NavLink to="/staff/attendance-by-date">Daily Attendance</NavLink>
            <NavLink to="/staff/mark-attendance">Mark Attendance</NavLink>
          </nav>

          <button
            className="staff-back"
            onClick={() => navigate("/services")}
          >
            &larr; Back to Services
          </button>

        </aside>

        <main className="main-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default StaffLayout;
