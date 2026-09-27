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
}
