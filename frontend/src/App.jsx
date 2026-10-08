import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EditStudentPage from './pages/EditStudentPage.jsx';
import RegisterStudentPage from './pages/RegisterStudentPage.jsx';
import StudentSearch from './StudentSearch';
import Navigation from './components/Navigation';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register-student" element={<RegisterStudentPage />} />
                <Route path="/edit-student" element={<EditStudentPage />} />
                <Route path="/search-student" element={<StudentSearch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;