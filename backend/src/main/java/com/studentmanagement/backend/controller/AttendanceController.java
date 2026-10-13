package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.dto.AttendanceSummaryResponse;
import com.studentmanagement.backend.dto.WeeklyAttendanceRequest;
import com.studentmanagement.backend.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @PostMapping("/weekly")
    public ResponseEntity<Map<String, Object>> saveWeekly(@RequestBody WeeklyAttendanceRequest req) {
        int saved = service.saveWeeklyAttendance(req);
        return ResponseEntity.ok(Map.of("message", "Weekly attendance saved", "recordsSaved", saved));
    }

    @GetMapping("/student/{studentId}")
    public List<Map<String, Object>> studentWeeks(@PathVariable String studentId) {
        return service.getStudentAttendance(studentId).stream().map(a -> Map.<String, Object>of(
                "weekStart", a.getWeekStartDate(),
                "weekEnd", a.getWeekEndDate(),
                "totalDays", a.getTotalDays(),
                "daysPresent", a.getDaysPresent())).toList();
    }

    @PostMapping("/summary/generate")
    public List<AttendanceSummaryResponse> generate(@RequestParam int year, @RequestParam int month) {
        return service.generateMonthlySummary(year, month);
    }

    @GetMapping("/summary")
    public List<AttendanceSummaryResponse> monthly(@RequestParam int year, @RequestParam int month) {
        return service.getMonthlySummaries(year, month);
    }

    @GetMapping("/summary/student/{studentId}")
    public List<AttendanceSummaryResponse> studentSummaries(@PathVariable String studentId) {
        return service.getStudentSummaries(studentId);
    }
}