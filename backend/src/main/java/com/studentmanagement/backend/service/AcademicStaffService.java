package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dao.AcademicStaffDAO;
import com.studentmanagement.backend.model.Attendance;
import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.SalaryCalculation;
import com.studentmanagement.backend.model.SalarySummary;
import com.studentmanagement.backend.model.Staff;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AcademicStaffService {

    // Fixed percentages of base salary. Change these two numbers to
    // match your school's rules.
    private static final double ALLOWANCE_PERCENT = 10.0;  // added to base salary
    private static final double DEDUCTION_PERCENT = 8.0;   // taken off (e.g. EPF)

    private final AcademicStaffDAO dao;

    public AcademicStaffService(AcademicStaffDAO dao) {
        this.dao = dao;
    }

    public Staff getStaffDetails(int staffId) {
        return dao.getStaffDetails(staffId);
    }

    public List<Salary> getSalaryDetails(int staffId) {
        return dao.getSalaryDetails(staffId);
    }

    public List<Attendance> getAttendanceDetails(int staffId) {
        return dao.getAttendanceDetails(staffId);
    }

    public SalaryCalculation calculateSalary(int staffId) {

        Staff staff = dao.getStaffDetails(staffId);

        if (staff == null) {
            return null;
        }

        double base = staff.getBaseSalary();
        double allowances = round2(base * ALLOWANCE_PERCENT / 100.0);
        double deductions = round2(base * DEDUCTION_PERCENT / 100.0);
        double net = round2(base + allowances - deductions);

        SalaryCalculation result = new SalaryCalculation();
        result.setStaffId(staffId);
        result.setStaffName(staff.getFirstName() + " " + staff.getLastName());
        result.setBaseSalary(base);
        result.setAllowancePercent(ALLOWANCE_PERCENT);
        result.setAllowances(allowances);
        result.setDeductionPercent(DEDUCTION_PERCENT);
        result.setDeductions(deductions);
        result.setNetSalary(net);

        return result;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public SalarySummary getSalarySummary(int month, int year) {
        return dao.getSalarySummary(month, year);
    }

    // Returns null when the date is not a valid YYYY-MM-DD date
    public List<Attendance> getAttendanceByDate(String date) {

        try {
            LocalDate.parse(date);
        } catch (Exception e) {
            return null;
        }

        return dao.getAttendanceByDate(date);
    }

    // Returns: created, updated, staff_not_found, invalid_status,
    // invalid_date or error
    public String markAttendance(Attendance attendance) {

        String status = normalizeStatus(attendance.getStatus());

        if (status == null) {
            return "invalid_status";
        }

        String date;

        try {
            date = LocalDate.parse(attendance.getAttendanceDate()).toString();
        } catch (Exception e) {
            return "invalid_date";
        }

        String remarks = attendance.getRemarks() == null
                ? "" : attendance.getRemarks().trim();

        attendance.setStatus(status);
        attendance.setAttendanceDate(date);
        attendance.setRemarks(remarks);

        return dao.markAttendance(attendance);
    }

    private String normalizeStatus(String status) {

        if (status == null) {
            return null;
        }

        return switch (status.trim().toLowerCase()) {
            case "present" -> "Present";
            case "absent" -> "Absent";
            case "late" -> "Late";
            default -> null;
        };
    }
}
