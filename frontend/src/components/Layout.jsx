import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="logo">
          <h2>Focus School</h2>
          <p>Staff Management</p>
        </div>

        <nav className="menu">
          <NavLink to="/salary">Salary Details</NavLink>
          <NavLink to="/salary-calculation">Salary Calculation</NavLink>
          <NavLink to="/salary-summary">Salary Summary</NavLink>
          <NavLink to="/attendance">Staff Attendance</NavLink>
          <NavLink to="/attendance-by-date">Daily Attendance</NavLink>
          <NavLink to="/mark-attendance">Mark Attendance</NavLink>
        </nav>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;
