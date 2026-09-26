package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.LeaveRequest;
import com.studentmanagement.backend.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public LeaveRequest createLeaveRequest(
            @RequestBody LeaveRequest leaveRequest) {

        return leaveRequestService.createLeaveRequest(leaveRequest);
    }

    @GetMapping("/staff/{staffId}")
    public List<LeaveRequest> getStaffLeaveRequests(
            @PathVariable Integer staffId) {

        return leaveRequestService.getLeaveRequestsByStaff(staffId);
    }

    @GetMapping("/{id}")
    public LeaveRequest getLeaveRequest(
            @PathVariable Integer id) {

        return leaveRequestService.getLeaveRequestById(id);
    }
}

