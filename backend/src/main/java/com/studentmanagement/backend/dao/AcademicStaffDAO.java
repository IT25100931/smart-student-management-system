package com.studentmanagement.backend.dao;

import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.Staff;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AcademicStaffDAO {

    private final DataSource dataSource;

    // Spring injects the connection settings from application.properties
    public AcademicStaffDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private Connection getConnection() throws SQLException {
        return dataSource.getConnection();
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
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            try (ResultSet rs = statement.executeQuery()) {

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
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            try (ResultSet rs = statement.executeQuery()) {

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

                    salary.setPaymentStatus(rs.getString("payment_status"));

                    salaries.add(salary);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return salaries;
    }
}