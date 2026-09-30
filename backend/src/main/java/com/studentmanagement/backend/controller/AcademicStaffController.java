package com.studentmanagement.backend.controller;

import com.example.schoollms.model.LeaveRequest;
import com.example.schoollms.model.Salary;
import com.example.schoollms.model.Staff;
import com.example.schoollms.service.AcademicStaffService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-staff")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicStaffController {

    private final AcademicStaffService service =
            new AcademicStaffService();


    // ==========================
    // VIEW STAFF DETAILS
    // ==========================

    @GetMapping("/{staffId}")
    public Staff getStaffDetails(
            @PathVariable int staffId) {

        return service.getStaffDetails(staffId);
    }


    // ==========================
    // VIEW SALARY DETAILS
    // ==========================

    @GetMapping("/{staffId}/salary")
    public List<Salary> getSalaryDetails(
            @PathVariable int staffId) {

        return service.getSalaryDetails(staffId);
    }


    // ==========================
    // REQUEST LEAVE
    // ==========================

    @PostMapping("/leave")
    public String requestLeave(
            @RequestBody LeaveRequest leaveRequest) {

        boolean success =
                service.requestLeave(leaveRequest);

        if (success) {
            return "Leave request submitted successfully";
        }

        return "Failed to submit leave request";
    }
}