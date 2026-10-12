
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterStudentPage from "./pages/RegisterStudentPage.jsx";
import EditStudentPage from "./pages/EditStudentPage.jsx";

import StudentSearch from "./pages/StudentSearch.jsx";
import AcademicStaffDashboard from "./pages/AcademicStaffDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import "./App.css";

// Temporary page until the Parent Dashboard is integrated.
function ParentDashboardPlaceholder() {
  return (
      <main className="placeholder-dashboard">
        <h1>Parent Dashboard</h1>
        <p>
          The parent dashboard will be integrated here.
        </p>

        <button
            type="button"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
        >
          Log out
        </button>
      </main>
  );
}

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route
              path="/"
              element={<LoginPage />}
          />

          {/* Administrative Staff Dashboard */}
          <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
          />

          {/* Academic Staff Dashboard */}
          <Route
              path="/teacher-dashboard"
              element={<AcademicStaffDashboard />}
          />

          {/* Parent Dashboard */}
          <Route
              path="/parent-dashboard"
              element={<ParentDashboardPlaceholder />}
          />

          {/* Student Management */}
          <Route
              path="/search-student"
              element={<StudentSearch />}
          />

          <Route
              path="/register-student"
              element={<RegisterStudentPage />}
          />

          <Route
              path="/edit-student"
              element={<EditStudentPage />}
          />

          {/* Unknown URLs return to login */}
          <Route
              path="*"
              element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;