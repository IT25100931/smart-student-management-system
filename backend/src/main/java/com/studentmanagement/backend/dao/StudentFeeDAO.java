package com.studentmanagement.backend.dao;

import com.studentmanagement.backend.config.DatabaseConnection;
import com.studentmanagement.backend.model.StudentFee;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentFeeDAO {

    public List getStudentFeeStatus(String studentId) {
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

    // Fix for: Cannot resolve method 'getFilteredFees' in 'StudentFeeDAO'
    public List getFilteredFees(String studentId, String status, String feeType) {
        List list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM STUDENT_FEES WHERE 1=1 ");

        if (studentId != null && !studentId.trim().isEmpty()) sql.append(" AND student_id = ?");
        if (status != null && !status.trim().isEmpty()) sql.append(" AND payment_status = ?");
        if (feeType != null && !feeType.trim().isEmpty()) sql.append(" AND fee_type = ?");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (studentId != null && !studentId.trim().isEmpty()) ps.setString(paramIndex++, studentId);
            if (status != null && !status.trim().isEmpty()) ps.setString(paramIndex++, status);
            if (feeType != null && !feeType.trim().isEmpty()) ps.setString(paramIndex++, feeType);

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

    // Fix for: Cannot resolve method 'updateFeeAfterSlipApproval' in 'StudentFeeDAO'
    public boolean updateFeeAfterSlipApproval(int feeId, BigDecimal approvedAmount) {
        String query = "SELECT total_amount, paid_amount FROM STUDENT_FEES WHERE fee_id = ?";
        String update = "UPDATE STUDENT_FEES SET paid_amount = ?, payment_status = ?, payment_date = ? WHERE fee_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement psQuery = conn.prepareStatement(query)) {

            psQuery.setInt(1, feeId);
            ResultSet rs = psQuery.executeQuery();

            if (rs.next()) {
                BigDecimal total = rs.getBigDecimal("total_amount");
                BigDecimal currentPaid = rs.getBigDecimal("paid_amount");
                BigDecimal updatedPaid = currentPaid.add(approvedAmount);

                String newStatus = updatedPaid.compareTo(total) >= 0 ? "PAID" : "PARTIAL";

                try (PreparedStatement psUpdate = conn.prepareStatement(update)) {
                    psUpdate.setBigDecimal(1, updatedPaid);
                    psUpdate.setString(2, newStatus);
                    psUpdate.setDate(3, new java.sql.Date(System.currentTimeMillis()));
                    psUpdate.setInt(4, feeId);
                    return psUpdate.executeUpdate() > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}