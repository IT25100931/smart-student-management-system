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

}
