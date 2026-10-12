import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ServicesHome from './pages/ServicesHome.jsx';
import StudentManagementPage from './pages/StudentManagementPage.jsx';
import RegisterStudentPage from './pages/RegisterStudentPage.jsx';
import EditStudentPage from './pages/EditStudentPage.jsx';
import StudentSearch from './pages/StudentSearch.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import LeaveManagement from './pages/LeaveManagement.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ServicePage from './components/ServicePage.jsx';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                {/* Public authentication route */}
                <Route path="/" element={<LoginPage />} />

                {/* Services hub (any logged-in user) */}
                <Route
                    path="/services"
                    element={
                        <ProtectedRoute>
                            <ServicesHome />
                        </ProtectedRoute>
                    }
                />

                {/* Student management menu */}
                <Route
                    path="/student-management"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                            <ServicePage>
                                <StudentManagementPage />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />

                {/* Admin-only student pages */}
                <Route
                    path="/register-student"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <ServicePage backTo="/student-management" backLabel="Back to Student Management">
                                <RegisterStudentPage />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-student"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <ServicePage backTo="/student-management" backLabel="Back to Student Management">
                                <EditStudentPage />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />

                {/* Other services */}
                <Route
                    path="/search-student"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                            <ServicePage backTo="/student-management" backLabel="Back to Student Management">
                                <StudentSearch />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leave-management"
                    element={
                        <ProtectedRoute>
                            <ServicePage>
                                <LeaveManagement />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'PARENT']}>
                            <ServicePage>
                                <PaymentPage />
                            </ServicePage>
                        </ProtectedRoute>
                    }
                />

                {/* Keep these last */}
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;