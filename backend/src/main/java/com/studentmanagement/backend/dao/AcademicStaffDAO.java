package com.studentmanagement.backend.dao;

import com.studentmanagement.backend.model.Attendance;
import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.SalarySummary;
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


    // ==========================
    // 3. VIEW ATTENDANCE
    // ==========================

    public List<Attendance> getAttendanceDetails(int staffId) {

        List<Attendance> records = new ArrayList<>();

        String sql = """
                SELECT *
                FROM STAFF_ATTENDANCE
                WHERE staff_id = ?
                ORDER BY attendance_id DESC
                """;

        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    Attendance record = new Attendance();

                    record.setAttendanceId(rs.getInt("attendance_id"));
                    record.setStaffId(rs.getInt("staff_id"));

                    // Column names are matched flexibly, because the
                    // attendance table may name them slightly differently
                    record.setAttendanceDate(
                            firstExisting(rs, "attendance_date", "date"));
                    record.setStatus(
                            firstExisting(rs, "status", "attendance_status"));
                    record.setCheckInTime(
                            firstExisting(rs, "check_in_time", "check_in"));
                    record.setCheckOutTime(
                            firstExisting(rs, "check_out_time", "check_out"));
                    record.setRemarks(
                            firstExisting(rs, "remarks", "remark"));

                    records.add(record);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return records;
    }

    // Returns the value of the first column name that exists, or "-"
    private String firstExisting(ResultSet rs, String... columns)
            throws SQLException {

        ResultSetMetaData meta = rs.getMetaData();

        for (String column : columns) {
            for (int i = 1; i <= meta.getColumnCount(); i++) {
                if (meta.getColumnLabel(i).equalsIgnoreCase(column)) {
                    Object value = rs.getObject(i);
                    return value == null ? "-" : value.toString();
                }
            }
        }

        return "-";
    }


    // ==========================
    // 4. MONTHLY SALARY SUMMARY
    // ==========================

    // Paid = payment_status PAID. Pending = every other status.
    public SalarySummary getSalarySummary(int month, int year) {

        SalarySummary summary = new SalarySummary();
        summary.setMonth(month);
        summary.setYear(year);

        String sql = """
                SELECT COUNT(*) AS total_records,
                       COALESCE(SUM(CASE WHEN UPPER(payment_status) = 'PAID'
                                         THEN 1 ELSE 0 END), 0) AS paid_count,
                       COALESCE(SUM(CASE WHEN UPPER(payment_status) = 'PAID'
                                         THEN net_salary ELSE 0 END), 0) AS paid_total,
                       COALESCE(SUM(CASE WHEN UPPER(payment_status) <> 'PAID'
                                         THEN 1 ELSE 0 END), 0) AS pending_count,
                       COALESCE(SUM(CASE WHEN UPPER(payment_status) <> 'PAID'
                                         THEN net_salary ELSE 0 END), 0) AS pending_total
                FROM STAFF_SALARY
                WHERE salary_month = ? AND salary_year = ?
                """;

        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, month);
            statement.setInt(2, year);

            try (ResultSet rs = statement.executeQuery()) {

                if (rs.next()) {
                    summary.setTotalRecords(rs.getInt("total_records"));
                    summary.setPaidCount(rs.getInt("paid_count"));
                    summary.setPaidTotal(rs.getDouble("paid_total"));
                    summary.setPendingCount(rs.getInt("pending_count"));
                    summary.setPendingTotal(rs.getDouble("pending_total"));
                    summary.setGrandTotal(
                            summary.getPaidTotal() + summary.getPendingTotal());
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return summary;
    }


    // ==========================
    // 5. VIEW ALL STAFF ATTENDANCE FOR ONE DATE
    // ==========================

    // Lists every staff member. Staff with no record for that date
    // are shown with the status "Not marked".
    public List<Attendance> getAttendanceByDate(String date) {

        List<Attendance> records = new ArrayList<>();

        try (Connection connection = getConnection()) {

            String dateCol = findColumn(connection, "attendance_date", "date");
            String statusCol = findColumn(connection, "attendance_status", "status");
            String remarksCol = findColumn(connection, "remarks", "remark");

            if (dateCol == null) {
                return records;
            }

            String sql = "SELECT s.staff_id, s.first_name, s.last_name, "
                    + (statusCol != null ? "a." + statusCol : "NULL") + " AS att_status, "
                    + (remarksCol != null ? "a." + remarksCol : "NULL") + " AS att_remarks "
                    + "FROM STAFF s "
                    + "LEFT JOIN STAFF_ATTENDANCE a "
                    + "ON a.staff_id = s.staff_id AND a." + dateCol + " = ? "
                    + "ORDER BY s.staff_id";

            try (PreparedStatement statement = connection.prepareStatement(sql)) {

                statement.setDate(1, Date.valueOf(date));

                try (ResultSet rs = statement.executeQuery()) {

                    while (rs.next()) {

                        Attendance record = new Attendance();

                        record.setStaffId(rs.getInt("staff_id"));
                        record.setStaffName(
                                rs.getString("first_name") + " " + rs.getString("last_name"));
                        record.setAttendanceDate(date);

                        String status = rs.getString("att_status");
                        String remarks = rs.getString("att_remarks");

                        record.setStatus(status == null ? "Not marked" : status);
                        record.setRemarks(remarks == null || remarks.isBlank() ? "-" : remarks);

                        records.add(record);
                    }
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return records;
    }


    // ==========================
    // 6. MARK ATTENDANCE FOR A DAY
    // ==========================

    // Returns: "created", "updated", "staff_not_found" or "error".
    // If the staff member already has a record for that date it is updated,
    // so a day is never recorded twice.
    public String markAttendance(Attendance attendance) {

        try (Connection connection = getConnection()) {

            try (PreparedStatement check = connection.prepareStatement(
                    "SELECT 1 FROM STAFF WHERE staff_id = ?")) {

                check.setInt(1, attendance.getStaffId());

                try (ResultSet rs = check.executeQuery()) {
                    if (!rs.next()) {
                        return "staff_not_found";
                    }
                }
            }

            String dateCol = findColumn(connection, "attendance_date", "date");
            String statusCol = findColumn(connection, "attendance_status", "status");
            String remarksCol = findColumn(connection, "remarks", "remark");

            if (dateCol == null || statusCol == null) {
                return "error";
            }

            Date date = Date.valueOf(attendance.getAttendanceDate());

            // 1. Try to update an existing record for that staff and date
            String update = "UPDATE STAFF_ATTENDANCE SET " + statusCol + " = ?"
                    + (remarksCol != null ? ", " + remarksCol + " = ?" : "")
                    + " WHERE staff_id = ? AND " + dateCol + " = ?";

            try (PreparedStatement ps = connection.prepareStatement(update)) {

                int i = 1;
                ps.setString(i++, attendance.getStatus());
                if (remarksCol != null) {
                    ps.setString(i++, attendance.getRemarks());
                }
                ps.setInt(i++, attendance.getStaffId());
                ps.setDate(i, date);

                if (ps.executeUpdate() > 0) {
                    return "updated";
                }
            }

            // 2. No record yet, so insert a new one
            String insert = "INSERT INTO STAFF_ATTENDANCE (staff_id, " + dateCol + ", "
                    + statusCol + (remarksCol != null ? ", " + remarksCol : "") + ") "
                    + "VALUES (?, ?, ?" + (remarksCol != null ? ", ?" : "") + ")";

            try (PreparedStatement ps = connection.prepareStatement(insert)) {

                int i = 1;
                ps.setInt(i++, attendance.getStaffId());
                ps.setDate(i++, date);
                ps.setString(i++, attendance.getStatus());
                if (remarksCol != null) {
                    ps.setString(i, attendance.getRemarks());
                }

                return ps.executeUpdate() > 0 ? "created" : "error";
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return "error";
        }
    }

    // Finds the real name of an attendance column from a list of likely
    // names. Returns null if none of them exist.
    private String findColumn(Connection connection, String... candidates)
            throws SQLException {

        try (Statement statement = connection.createStatement();
             ResultSet rs = statement.executeQuery(
                     "SELECT * FROM STAFF_ATTENDANCE LIMIT 0")) {

            ResultSetMetaData meta = rs.getMetaData();

            for (String candidate : candidates) {
                for (int i = 1; i <= meta.getColumnCount(); i++) {
                    if (meta.getColumnLabel(i).equalsIgnoreCase(candidate)) {
                        return meta.getColumnLabel(i);
                    }
                }
            }
        }

        return null;
    }
}
