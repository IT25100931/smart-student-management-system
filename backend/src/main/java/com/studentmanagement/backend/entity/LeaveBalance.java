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

    public Integer getBalanceId() {
        return balanceId;
    }
    public void setBalanceId(Integer balanceId) {
        this.balanceId = balanceId;
    }

    public Staff getStaff() {
        return staff;
    }
    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public Integer getAcademicYear() {
        return academicYear;
    }
    public void setAcademicYear(Integer academicYear) {
        this.academicYear = academicYear;
    }

    public Integer getFullDayTotal() {
        return fullDayTotal;
    }
    public void setFullDayTotal(Integer fullDayTotal) {
        this.fullDayTotal = fullDayTotal;
    }

    public Integer getShortLeaveTotal() {
        return shortLeaveTotal;
    }
    public void setShortLeaveTotal(Integer shortLeaveTotal) {
        this.shortLeaveTotal = shortLeaveTotal;
    }

    public Integer getMonthlyFullDayTotal() {
        return monthlyFullDayTotal;
    }
    public void setMonthlyFullDayTotal(Integer monthlyFullDayTotal) {
        this.monthlyFullDayTotal = monthlyFullDayTotal;
    }

    public Integer getMonthlyShortLeaveTotal() {
        return monthlyShortLeaveTotal;
    }
    public void setMonthlyShortLeaveTotal(Integer monthlyShortLeaveTotal) {
        this.monthlyShortLeaveTotal = monthlyShortLeaveTotal;
    }
}
