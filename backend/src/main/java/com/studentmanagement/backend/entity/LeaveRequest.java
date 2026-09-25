package com.studentmanagement.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "LEAVE_REQUESTS")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveId;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)

    private Staff staff;

    private String leaveType;
    private LocalDate startDate;

    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer totalDays;

    private String reason;

    private String status;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Staff approvedBy;

    private LocalDateTime approvedAt;
    private LocalDateTime appliedAt;

    // getters/setters

    public Integer getLeaveId() {
        return leaveId;
    }
    public void setLeaveId(Integer leaveId) {
        this.leaveId = leaveId;
    }

    public Staff getStaff() {
        return staff;
    }
    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public String getLeaveType() {
        return leaveType;
    }
    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Staff getApprovedBy() {
        return approvedBy;
    }
    public void setApprovedBy(Staff approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
