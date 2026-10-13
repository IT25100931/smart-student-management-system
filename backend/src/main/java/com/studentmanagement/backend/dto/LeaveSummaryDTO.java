package com.studentmanagement.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class LeaveSummaryDTO {

    private int fullDayRemaining;
    private int fullDayTotal;

    private int shortLeaveRemaining;
    private int shortLeaveTotal;

    private int monthlyFullDayRemaining;
    private int monthlyFullDayTotal;

    private int monthlyShortLeaveRemaining;
    private int monthlyShortLeaveTotal;

    private List<LocalDate> upcomingLeaveDays;

    public LeaveSummaryDTO() {
    }

    public LeaveSummaryDTO(
            int fullDayRemaining,
            int fullDayTotal,
            int shortLeaveRemaining,
            int shortLeaveTotal,
            int monthlyFullDayRemaining,
            int monthlyFullDayTotal,
            int monthlyShortLeaveRemaining,
            int monthlyShortLeaveTotal,
            List<LocalDate> upcomingLeaveDays) {

        this.fullDayRemaining = fullDayRemaining;
        this.fullDayTotal = fullDayTotal;

        this.shortLeaveRemaining = shortLeaveRemaining;
        this.shortLeaveTotal = shortLeaveTotal;

        this.monthlyFullDayRemaining = monthlyFullDayRemaining;
        this.monthlyFullDayTotal = monthlyFullDayTotal;

        this.monthlyShortLeaveRemaining = monthlyShortLeaveRemaining;
        this.monthlyShortLeaveTotal = monthlyShortLeaveTotal;

        this.upcomingLeaveDays = upcomingLeaveDays;
    }

    public int getFullDayRemaining() {
        return fullDayRemaining;
    }

    public int getFullDayTotal() {
        return fullDayTotal;
    }

    public int getShortLeaveRemaining() {
        return shortLeaveRemaining;
    }

    public int getShortLeaveTotal() {
        return shortLeaveTotal;
    }

    public int getMonthlyFullDayRemaining() {
        return monthlyFullDayRemaining;
    }

    public int getMonthlyFullDayTotal() {
        return monthlyFullDayTotal;
    }

    public int getMonthlyShortLeaveRemaining() {
        return monthlyShortLeaveRemaining;
    }

    public int getMonthlyShortLeaveTotal() {
        return monthlyShortLeaveTotal;
    }

    public List<LocalDate> getUpcomingLeaveDays() {
        return upcomingLeaveDays;
    }
}