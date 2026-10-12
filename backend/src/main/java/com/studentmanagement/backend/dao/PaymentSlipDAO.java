package com.studentmanagement.backend.dao;

import com.studentmanagement.backend.config.DatabaseConnection;
import com.studentmanagement.backend.model.PaymentSlip;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PaymentSlipDAO {

        // Function 7: Insert submitted payment slip
        public boolean submitSlip(PaymentSlip slip) {
            String sql = "INSERT INTO PAYMENT_SLIPS (fee_id, student_id, payment_reference, amount, slip_file_path, verification_status) "
                    + "VALUES (?, ?, ?, ?, ?, 'PENDING')";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, slip.getFeeId());
                ps.setString(2, slip.getStudentId());
                ps.setString(3, slip.getPaymentReference());
                ps.setBigDecimal(4, slip.getAmount());
                ps.setString(5, slip.getSlipFilePath());
                return ps.executeUpdate() > 0;
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }

        // Function 7: Staff verification update
        public boolean verifySlip(int slipId, String status, String staffId, String remarks) {
            String sql = "UPDATE PAYMENT_SLIPS SET verification_status = ?, verified_by = ?, "
                    + "verification_date = CURRENT_TIMESTAMP, remarks = ? WHERE slip_id = ?";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, status);
                ps.setString(2, staffId);
                ps.setString(3, remarks);
                ps.setInt(4, slipId);
                return ps.executeUpdate() > 0;
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }

        // Function 8: Retrieve payment slips by student or status
        public List getPaymentSlips(String studentId, String status) {
            List slips = new ArrayList<>();
            StringBuilder sql = new StringBuilder("SELECT * FROM PAYMENT_SLIPS WHERE 1=1 ");

            if (studentId != null && !studentId.isEmpty()) sql.append(" AND student_id = ?");
            if (status != null && !status.isEmpty()) sql.append(" AND verification_status = ?");

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql.toString())) {

                int index = 1;
                if (studentId != null && !studentId.isEmpty()) ps.setString(index++, studentId);
                if (status != null && !status.isEmpty()) ps.setString(index++, status);

                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    PaymentSlip slip = new PaymentSlip();
                    slip.setSlipId(rs.getInt("slip_id"));
                    slip.setFeeId(rs.getInt("fee_id"));
                    slip.setStudentId(rs.getString("student_id"));
                    slip.setPaymentReference(rs.getString("payment_reference"));
                    slip.setAmount(rs.getBigDecimal("amount"));
                    slip.setSlipFilePath(rs.getString("slip_file_path"));
                    slip.setSubmissionDate(rs.getTimestamp("submission_date") != null ? rs.getTimestamp("submission_date").toLocalDateTime() : null);
                    slip.setVerificationStatus(rs.getString("verification_status"));
                    slip.setVerifiedBy(rs.getString("verified_by"));
                    slip.setVerificationDate(rs.getTimestamp("verification_date") != null ? rs.getTimestamp("verification_date").toLocalDateTime() : null);
                    slip.setRemarks(rs.getString("remarks"));
                    slips.add(slip);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return slips;
        }
}
