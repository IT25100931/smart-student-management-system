package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.Staff;
import com.studentmanagement.backend.service.AcademicStaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}