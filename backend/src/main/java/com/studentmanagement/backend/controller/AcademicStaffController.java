package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.model.AttendanceStaff;
import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.SalaryCalculation;
import com.studentmanagement.backend.model.SalarySummary;
import com.studentmanagement.backend.model.Staff;
import com.studentmanagement.backend.service.AcademicStaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicStaffController {

    private final AcademicStaffService service;

    public AcademicStaffController(AcademicStaffService service) {
        this.service = service;
    }

    // GET http://localhost:8080/api/staff/1
    @GetMapping("/{staffId}")
    public ResponseEntity<Staff> getStaffDetails(@PathVariable int staffId) {
        Staff staff = service.getStaffDetails(staffId);

        if (staff == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(staff);
    }

    // GET http://localhost:8080/api/staff/1/salary
    @GetMapping("/{staffId}/salary")
    public List<Salary> getSalaryDetails(@PathVariable int staffId) {
        return service.getSalaryDetails(staffId);
    }

    // GET http://localhost:8080/api/staff/1/attendance
    @GetMapping("/{staffId}/attendance")
    public List<AttendanceStaff> getAttendanceDetails(@PathVariable int staffId) {
        return service.getAttendanceDetails(staffId);
    }

    // GET http://localhost:8080/api/staff/1/salary/calculate
    @GetMapping("/{staffId}/salary/calculate")
    public ResponseEntity<SalaryCalculation> calculateSalary(@PathVariable int staffId) {
        SalaryCalculation result = service.calculateSalary(staffId);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }

    // GET http://localhost:8080/api/staff/salary/summary?month=9&year=2026
    @GetMapping("/salary/summary")
    public SalarySummary getSalarySummary(@RequestParam int month,
                                          @RequestParam int year) {
        return service.getSalarySummary(month, year);
    }

    // GET http://localhost:8080/api/staff/attendance?date=2026-09-28
    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceStaff>> getAttendanceByDate(@RequestParam String date) {
        List<AttendanceStaff> records = service.getAttendanceByDate(date);

        if (records == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(records);
    }

    // POST http://localhost:8080/api/staff/attendance
    // Body: {"staffId":1,"attendanceDate":"2026-09-28","status":"Present","remarks":"On time"}
    @PostMapping("/attendance")
    public ResponseEntity<Map<String, String>> markAttendance(@RequestBody AttendanceStaff attendance) {

        String result = service.markAttendance(attendance);

        return switch (result) {
            case "created" -> ResponseEntity.ok(
                    Map.of("message", "Attendance marked successfully"));
            case "updated" -> ResponseEntity.ok(
                    Map.of("message", "Attendance updated for that date"));
            case "staff_not_found" -> ResponseEntity.status(404).body(
                    Map.of("message", "Staff member not found"));
            case "invalid_status" -> ResponseEntity.badRequest().body(
                    Map.of("message", "Status must be Present, Absent or Late"));
            case "invalid_date" -> ResponseEntity.badRequest().body(
                    Map.of("message", "Date must be in YYYY-MM-DD format"));
            default -> ResponseEntity.status(500).body(
                    Map.of("message", "Could not save attendance"));
        };
    }
}
