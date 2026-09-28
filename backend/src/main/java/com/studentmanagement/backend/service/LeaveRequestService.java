package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.LeaveRequest;
import com.studentmanagement.backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {

        // Check that a leave type was provided
        if (leaveRequest.getLeaveType() == null ||
                leaveRequest.getLeaveType().isBlank()) {
            throw new IllegalArgumentException("Leave type is required");
        }

        // Make sure the leave type is valid
        String leaveType = leaveRequest.getLeaveType().toUpperCase();

        if (!leaveType.equals("FULL_DAY") &&
                !leaveType.equals("SHORT")) {
            throw new IllegalArgumentException(
                    "Leave type must be FULL_DAY or SHORT");
        }

        // Dates are required for both types
        if (leaveRequest.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }

        if (leaveRequest.getEndDate() == null) {
            throw new IllegalArgumentException("End date is required");
        }

        // End date cannot be before start date
        if (leaveRequest.getEndDate()
                .isBefore(leaveRequest.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date");
        }

        // FULL DAY validation
        if (leaveType.equals("FULL_DAY")) {

            long numberOfDays = ChronoUnit.DAYS.between(
                    leaveRequest.getStartDate(),
                    leaveRequest.getEndDate()
            ) + 1;

            leaveRequest.setTotalDays((int) numberOfDays);

            // Full-day leave does not need times
            leaveRequest.setStartTime(null);
            leaveRequest.setEndTime(null);
        }

        // SHORT leave validation
        if (leaveType.equals("SHORT")) {

            // Short leave must be for one date
            if (!leaveRequest.getStartDate()
                    .equals(leaveRequest.getEndDate())) {

                throw new IllegalArgumentException(
                        "Short leave must be for one day");
            }

            // Short leave must have times
            if (leaveRequest.getStartTime() == null ||
                    leaveRequest.getEndTime() == null) {

                throw new IllegalArgumentException(
                        "Start time and end time are required for short leave");
            }

            // End time must be after start time
            if (!leaveRequest.getEndTime()
                    .isAfter(leaveRequest.getStartTime())) {

                throw new IllegalArgumentException(
                        "End time must be after start time");
            }

            // Short leave does not count as a full day
            leaveRequest.setTotalDays(0);
        }

        // Always normalize these values on a NEW request
        leaveRequest.setLeaveType(leaveType);
        leaveRequest.setStatus("PENDING");
        leaveRequest.setAppliedAt(LocalDateTime.now());

        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getLeaveRequestsByStaff(Integer staffId) {
        return leaveRequestRepository.findByStaffStaffId(staffId);
    }

    public LeaveRequest getLeaveRequestById(Integer id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found"));
    }
}
