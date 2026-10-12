package com.studentmanagement.backend.dto;

import com.studentmanagement.backend.model.AttendanceSummary;
import java.math.BigDecimal;

public record AttendanceSummaryResponse(
        String studentId, int year, int month,
        int totalDays, int daysPresent,
        BigDecimal percentage, String status) {

    public static AttendanceSummaryResponse from(AttendanceSummary s) {
        String status = s.getPercentage().compareTo(new BigDecimal("75")) >= 0 ? "OK" : "LOW";
        return new AttendanceSummaryResponse(
                s.getStudent().getStudentId(),
                s.getYear(), s.getMonth(),
                s.getTotalDays(), s.getDaysPresent(), s.getPercentage(), status);
    }
}