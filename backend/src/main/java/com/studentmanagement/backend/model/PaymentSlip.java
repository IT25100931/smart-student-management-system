package com.studentmanagement.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

        public PaymentSlip() {}

        //Getters and Setters
        public int getSlipId() { return slipId; }
        public void setSlipId(int slipId) { this.slipId = slipId; }

        public int getFeeId() { return feeId; }
        public void setFeeId(int feeId) { this.feeId = feeId; }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getPaymentReference() { return paymentReference; }
        public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getSlipFilePath() { return slipFilePath; }
        public void setSlipFilePath(String slipFilePath) { this.slipFilePath = slipFilePath; }

        public LocalDateTime getSubmissionDate() { return submissionDate; }
        public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

        public String getVerifiedBy() { return verifiedBy; }
        public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

        public LocalDateTime getVerificationDate() { return verificationDate; }
        public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }

}
