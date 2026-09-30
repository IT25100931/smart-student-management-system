package com.studentmanagement.backend.dao;


import com.example.schoollms.model.LeaveRequest;
import com.example.schoollms.model.Salary;
import com.example.schoollms.model.Staff;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AcademicStaffDAO {

    private final String URL =
            "jdbc:mysql://localhost:3306/school_lms_db";

    private final String USER = "root";

    private final String PASSWORD = "YOUR_PASSWORD";


    // ==========================
    // DATABASE CONNECTION
    // ==========================

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }


    // ==========================
    // 1. VIEW STAFF DETAILS
    // ==========================

    public Staff getStaffDetails(int staffId) {

        String sql = """
                SELECT staff_id, user_id, first_name, last_name,
                       email, contact_no, department,
                       designation, base_salary, join_date, status
                FROM STAFF
                WHERE staff_id = ?
                """;

        try (Connection connection = getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            ResultSet rs = statement.executeQuery();

            if (rs.next()) {

                Staff staff = new Staff();

                staff.setStaffId(rs.getInt("staff_id"));
                staff.setUserId(rs.getInt("user_id"));
                staff.setFirstName(rs.getString("first_name"));
                staff.setLastName(rs.getString("last_name"));
                staff.setEmail(rs.getString("email"));
                staff.setContactNo(rs.getString("contact_no"));
                staff.setDepartment(rs.getString("department"));
                staff.setDesignation(rs.getString("designation"));
                staff.setBaseSalary(rs.getDouble("base_salary"));

                Date joinDate = rs.getDate("join_date");

                if (joinDate != null) {
                    staff.setJoinDate(joinDate.toString());
                }

                staff.setStatus(rs.getString("status"));

                return staff;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }


    // ==========================
    // 2. VIEW SALARY DETAILS
    // ==========================

    public List<Salary> getSalaryDetails(int staffId) {

        List<Salary> salaries = new ArrayList<>();

        String sql = """
                SELECT salary_id, staff_id, salary_month,
                       salary_year, base_salary, allowances,
                       deductions, net_salary, payment_date,
                       payment_status
                FROM STAFF_SALARY
                WHERE staff_id = ?
                ORDER BY salary_year DESC, salary_month DESC
                """;

        try (Connection connection = getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            ResultSet rs = statement.executeQuery();

            while (rs.next()) {

                Salary salary = new Salary();

                salary.setSalaryId(rs.getInt("salary_id"));
                salary.setStaffId(rs.getInt("staff_id"));
                salary.setSalaryMonth(rs.getInt("salary_month"));
                salary.setSalaryYear(rs.getInt("salary_year"));
                salary.setBaseSalary(rs.getDouble("base_salary"));
                salary.setAllowances(rs.getDouble("allowances"));
                salary.setDeductions(rs.getDouble("deductions"));
                salary.setNetSalary(rs.getDouble("net_salary"));

                Date paymentDate = rs.getDate("payment_date");

                if (paymentDate != null) {
                    salary.setPaymentDate(paymentDate.toString());
                }

                salary.setPaymentStatus(
                        rs.getString("payment_status")
                );

                salaries.add(salary);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return salaries;
    }


    // ==========================
    // 3. REQUEST LEAVE
    // ==========================

    public boolean requestLeave(LeaveRequest leaveRequest) {

        String sql = """
                INSERT INTO LEAVE_REQUESTS
                (staff_id, leave_type, start_date, end_date,
                 total_days, reason, status)
                VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
                """;

        try (Connection connection = getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, leaveRequest.getStaffId());
            statement.setString(2, leaveRequest.getLeaveType());

            statement.setDate(
                    3,
                    Date.valueOf(leaveRequest.getStartDate())
            );

            statement.setDate(
                    4,
                    Date.valueOf(leaveRequest.getEndDate())
            );

            statement.setInt(
                    5,
                    leaveRequest.getTotalDays()
            );

            statement.setString(
                    6,
                    leaveRequest.getReason()
            );

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }
}