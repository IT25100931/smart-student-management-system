package com.studentmanagement.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "LEAVE_BALANCES")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer balanceId;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    private Integer academicYear;

    private Integer fullDayTotal;
    private Integer shortLeaveTotal;

    private Integer monthlyFullDayTotal;
    private Integer monthlyShortLeaveTotal;

    // getters/setters
}
