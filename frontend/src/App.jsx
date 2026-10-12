import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import EditStudentPage from './pages/EditStudentPage.jsx';
import RegisterStudentPage from './pages/RegisterStudentPage.jsx';
import StudentSearch from './pages/StudentSearch.jsx';
import LeaveManagement from './LeaveManagement';
import PaymentPage from './pages/PaymentPage.jsx';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
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

    return (
        <div className="service-page-wrapper">
            <button
                className="back-button"
                onClick={() => navigate('/services')}
                style={{ margin: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
                &larr; Back to Services
            </button>
            {children}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                {/* Public Authentication Route */}
                <Route path="/" element={<LoginPage />} />

                {/* Services Hub Route */}
                <Route path="/services" element={<ServicesHome />} />

                {/* Protected Student Management Routes (Admin Only) */}
                <Route
                    path="/register-student"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <RegisterStudentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-student"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <EditStudentPage />
                        </ProtectedRoute>
                    }
                />

                {/* Academic Services Routes */}
                <Route
                    path="/search-student"
                    element={
                        <ServicePage>
                            <StudentSearch />
                        </ServicePage>
                    }
                />
                <Route
                    path="/leave-management"
                    element={
                        <ServicePage>
                            <LeaveManagement />
                        </ServicePage>
                    }
                />
                <Route
                    path="/payments"
                    element={
                        <ServicePage>
                            <PaymentPage />
                        </ServicePage>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;