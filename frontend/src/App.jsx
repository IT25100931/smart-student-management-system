import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SalaryDetails from "./pages/SalaryDetails";
import SalaryCalculation from "./pages/SalaryCalculation";
import SalarySummary from "./pages/SalarySummary";
import StaffAttendance from "./pages/StaffAttendance";
import AttendanceByDate from "./pages/AttendanceByDate";
import MarkAttendance from "./pages/MarkAttendance";
import "./AcademicStaffManagement.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/salary" replace />} />
          <Route path="/salary" element={<SalaryDetails />} />
          <Route path="/salary-calculation" element={<SalaryCalculation />} />
          <Route path="/salary-summary" element={<SalarySummary />} />
          <Route path="/attendance" element={<StaffAttendance />} />
          <Route path="/attendance-by-date" element={<AttendanceByDate />} />
          <Route path="/mark-attendance" element={<MarkAttendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
