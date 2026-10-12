import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EditStudentPage from './pages/EditStudentPage.jsx';
import RegisterStudentPage from './pages/RegisterStudentPage.jsx';
import StudentSearch from './StudentSearch';
import ProtectedRoute from './components/ProtectedRoute';
//import Navigation from './components/Navigation';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register-student" element={ <ProtectedRoute allowedRoles={['ADMIN']}> <RegisterStudentPage /> </ProtectedRoute>} />
                <Route path="/edit-student" element={ <ProtectedRoute allowedRoles={['ADMIN']}> <EditStudentPage /> </ProtectedRoute>} />
                <Route path="/search-student" element={<StudentSearch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;