package com.studentmanagement.backend.dao;

import com.studentmanagement.backend.config.DatabaseConnection;
import com.studentmanagement.backend.model.StudentFee;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentFeeDAO {
    public List getStudentFeeStatus(String studentId) {
        // Specify  inside the ArrayList declaration
        List list = new ArrayList<>();
        String sql = "SELECT fee_id, student_id, fee_type, total_amount, paid_amount, "
                + "due_date, payment_status, payment_date "
                + "FROM STUDENT_FEES WHERE student_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, studentId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new StudentFee(
                        rs.getInt("fee_id"),
                        rs.getString("student_id"),
                        rs.getString("fee_type"),
                        rs.getBigDecimal("total_amount"),
                        rs.getBigDecimal("paid_amount"),
                        rs.getDate("due_date").toLocalDate(),
                        rs.getString("payment_status"),
                        rs.getDate("payment_date") != null ? rs.getDate("payment_date").toLocalDate() : null
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
