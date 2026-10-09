import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SalaryDetails from "./pages/SalaryDetails";
import StaffAttendance from "./pages/StaffAttendance";
import "./AcademicStaffManagement.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/salary" replace />} />
          <Route path="/salary" element={<SalaryDetails />} />
          <Route path="/attendance" element={<StaffAttendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
