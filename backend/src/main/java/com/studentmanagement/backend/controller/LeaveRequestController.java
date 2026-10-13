package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.LeaveRequest;
import com.studentmanagement.backend.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;
import com.studentmanagement.backend.dto.LeaveSummaryDTO;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("/summary/{staffId}")
    public LeaveSummaryDTO getLeaveSummary(
            @PathVariable Integer staffId) {

        return leaveRequestService.getLeaveSummary(staffId);
    }
    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }
    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeaveRequest(
            @PathVariable Integer id,
            @RequestParam Integer approvedBy) {

        return leaveRequestService.approveLeaveRequest(
                id,
                approvedBy
        );
    }
    @PutMapping("/{id}/reject")
    public LeaveRequest rejectLeaveRequest(
            @PathVariable Integer id,
            @RequestParam Integer approvedBy) {

        return leaveRequestService.rejectLeaveRequest(
                id,
                approvedBy
        );
    }
}

