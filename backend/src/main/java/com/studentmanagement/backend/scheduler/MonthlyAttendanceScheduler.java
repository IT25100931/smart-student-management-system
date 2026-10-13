package com.studentmanagement.backend.scheduler;

import com.studentmanagement.backend.service.AttendanceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.YearMonth;

@Component
public class MonthlyAttendanceScheduler {

    private final AttendanceService attendanceService;

    public MonthlyAttendanceScheduler(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Runs at 01:00 on the 1st of every month and calculates the month that just ended
    @Scheduled(cron = "0 0 1 1 * *")
    public void calculatePreviousMonth() {
        YearMonth previous = YearMonth.now().minusMonths(1);
        attendanceService.generateMonthlySummary(previous.getYear(), previous.getMonthValue());
    }
}