package com.studentmanagement.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentSlip {
    public class PaymentSlip {
        private int slipId;
        private int feeId;
        private String studentId;
        private String paymentReference;
        private BigDecimal amount;
        private String slipFilePath; // Stores uploaded file directory path reference
        private LocalDateTime submissionDate;
        private String verificationStatus; // PENDING, APPROVED, REJECTED
        private String verifiedBy;
        private LocalDateTime verificationDate;
        private String remarks;

        public PaymentSlip() {
        }
    }
}
