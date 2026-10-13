package com.studentmanagement.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class StudentFee {
    private int feeId;
    private String studentId;
    private String feeType;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private LocalDate dueDate;
    private String paymentStatus; // PAID, UNPAID, PARTIAL
    private LocalDate paymentDate;

    public StudentFee() {}

    public StudentFee(int feeId, String studentId, String feeType, BigDecimal totalAmount,
                      BigDecimal paidAmount, LocalDate dueDate, String paymentStatus, LocalDate paymentDate) {
        this.feeId = feeId;
        this.studentId = studentId;
        this.feeType = feeType;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
        this.balance = totalAmount.subtract(paidAmount != null ? paidAmount : BigDecimal.ZERO);
        this.dueDate = dueDate;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
    }

    // Getters and Setters
    public int getFeeId() { return feeId; }
    public void setFeeId(int feeId) { this.feeId = feeId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

}
