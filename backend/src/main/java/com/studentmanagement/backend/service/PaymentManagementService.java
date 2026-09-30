package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dao.PaymentSlipDAO;
import com.studentmanagement.backend.dao.StudentFeeDAO;
import com.studentmanagement.backend.model.PaymentSlip;
import com.studentmanagement.backend.model.StudentFee;

import java.math.BigDecimal;
import java.util.List;

public class PaymentManagementService {

    private final StudentFeeDAO feeDAO = new StudentFeeDAO();
    private final PaymentSlipDAO slipDAO = new PaymentSlipDAO();

    // Line 18-21 Fix: Strongly typed List ensures StudentFee::getBalance resolves cleanly
    public BigDecimal calculateTotalOutstandingBalance(String studentId) {
        List fees = feeDAO.getStudentFeeStatus(studentId);
        return fees.stream()
                .map(StudentFee::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List getStudentFeeStatus(String studentId) {
        return feeDAO.getStudentFeeStatus(studentId);
    }

    public boolean submitPaymentSlip(PaymentSlip slip) {
        if (slip.getAmount() == null || slip.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero.");
        }
        if (slip.getPaymentReference() == null || slip.getPaymentReference().trim().isEmpty()) {
            throw new IllegalArgumentException("Payment reference cannot be empty.");
        }
        return slipDAO.submitSlip(slip);
    }

    // Resolves line 44 call
    public boolean processSlipVerification(int slipId, int feeId, BigDecimal amount, String status, String staffId, String remarks) {
        boolean slipUpdated = slipDAO.verifySlip(slipId, status, staffId, remarks);
        if (slipUpdated && "APPROVED".equalsIgnoreCase(status)) {
            return feeDAO.updateFeeAfterSlipApproval(feeId, amount);
        }
        return slipUpdated;
    }

    // Resolves line 51 call
    public List filterFeeHistory(String studentId, String status, String feeType) {
        return feeDAO.getFilteredFees(studentId, status, feeType);
    }

    public List getPaymentSlips(String studentId, String status) {
        return slipDAO.getPaymentSlips(studentId, status);
    }
}