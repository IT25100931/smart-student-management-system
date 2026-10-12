import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import EditStudentPage from './pages/EditStudentPage.jsx';
import RegisterStudentPage from './pages/RegisterStudentPage.jsx';
import StudentSearch from './StudentSearch';
import LeaveManagement from './LeaveManagement';
import Navigation from './components/Navigation';
import PaymentPage from './pages/PaymentPage.jsx';
import './App.css';

// Home page for selecting academic services
function ServicesHome() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <h1>Smart Student Management System</h1>
            <p>Select a service to continue</p>

            <div className="home-buttons">
                <button
                    className="feature-button"
                    onClick={() => navigate('/search-student')}
                >
                    Student Management
                </button>

                <button
                     className="feature-button"
                     onClick={() => navigate('/payments')}
                >
                     Payment Management
                </button>

                <button
                    className="feature-button"
                    onClick={() => navigate('/leave-management')}
                >
                    Leave Management
                </button>
            </div>
        </div>
    );
}

// Wrapper providing a back button for academic services
function ServicePage({ children }) {
    const navigate = useNavigate();

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
            <Navigation />

            <Routes>
                {/* Existing routes from main */}
                <Route path="/" element={<LoginPage />} />

                <Route
                    path="/register-student"
                    element={<RegisterStudentPage />}
                />

                <Route
                    path="/edit-student"
                    element={<EditStudentPage />}
                />

                <Route
                    path="/search-student"
                    element={
                        <ServicePage>
                            <StudentSearch />
                        </ServicePage>
                    }
                />

                {/* New Academic Services routes */}
                <Route
                    path="/leave-management"
                    element={
                        <ServicePage>
                            <LeaveManagement />
                        </ServicePage>
                    }
                />

                {/* Payment Management */}
              <Route
                   path="/payments"
                   element={
                      <ServicePage>
                         <PaymentPage />
                      </ServicePage>
                  }
               />
                <Route
                    path="/services"
                    element={<ServicesHome />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
