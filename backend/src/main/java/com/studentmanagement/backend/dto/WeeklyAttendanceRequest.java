package com.studentmanagement.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record WeeklyAttendanceRequest(
        LocalDate weekStartDate,
        LocalDate weekEndDate,
        int totalDays,
        List<StudentEntry> entries) {

    public record StudentEntry(String studentId, int daysPresent, String remarks) {}
}