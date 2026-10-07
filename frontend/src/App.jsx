import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EditStudentPage from "./pages/EditStudentPage.jsx";
import RegisterStudentPage from "./pages/RegisterStudentPage.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register-student" element={<RegisterStudentPage />} />
          <Route path="/edit-student" element={<EditStudentPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;