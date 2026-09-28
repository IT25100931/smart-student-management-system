package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dto.LeaveSummaryDTO;
import com.studentmanagement.backend.entity.LeaveBalance;
import com.studentmanagement.backend.entity.LeaveRequest;
import com.studentmanagement.backend.repository.LeaveBalanceRepository;
import com.studentmanagement.backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            LeaveBalanceRepository leaveBalanceRepository) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    // ============================================================
    // CREATE LEAVE REQUEST
    // ============================================================

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {

        // Check that a leave type was provided
        if (leaveRequest.getLeaveType() == null ||
                leaveRequest.getLeaveType().isBlank()) {

            throw new IllegalArgumentException("Leave type is required");
        }

        // Convert to uppercase so values are stored consistently
        String leaveType = leaveRequest.getLeaveType().toUpperCase();

        // Only FULL_DAY and SHORT are allowed
        if (!leaveType.equals("FULL_DAY") &&
                !leaveType.equals("SHORT")) {

            throw new IllegalArgumentException(
                    "Leave type must be FULL_DAY or SHORT");
        }

        // Dates are required
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

        // --------------------------------------------------------
        // FULL DAY LEAVE
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // SHORT LEAVE
        // --------------------------------------------------------

        if (leaveType.equals("SHORT")) {

            // Short leave must be for one day
            if (!leaveRequest.getStartDate()
                    .equals(leaveRequest.getEndDate())) {

                throw new IllegalArgumentException(
                        "Short leave must be for one day");
            }

            // Short leave must have start and end times
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

            // Short leave is not counted as a full day
            leaveRequest.setTotalDays(0);
        }

        // --------------------------------------------------------
        // DEFAULT VALUES
        // --------------------------------------------------------

        // Store normalized leave type
        leaveRequest.setLeaveType(leaveType);

        // Every newly submitted request starts as PENDING
        leaveRequest.setStatus("PENDING");

        // Record when the request was submitted
        leaveRequest.setAppliedAt(LocalDateTime.now());

        // Save to database
        return leaveRequestRepository.save(leaveRequest);
    }


    // ============================================================
    // GET ALL LEAVE REQUESTS FOR A STAFF MEMBER
    // ============================================================

    public List<LeaveRequest> getLeaveRequestsByStaff(Integer staffId) {

        return leaveRequestRepository.findByStaffStaffId(staffId);
    }


    // ============================================================
    // GET ONE LEAVE REQUEST
    // ============================================================

    public LeaveRequest getLeaveRequestById(Integer id) {

        return leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found"));
    }


    // ============================================================
    // GET LEAVE SUMMARY
    // ============================================================

    public LeaveSummaryDTO getLeaveSummary(Integer staffId) {

        // Get the current year
        int currentYear = Year.now().getValue();

        // Find this teacher's leave balance
        LeaveBalance balance = leaveBalanceRepository
                .findByStaffStaffIdAndAcademicYear(
                        staffId,
                        currentYear
                )
                .orElseThrow(() ->
                        new RuntimeException("Leave balance not found"));


        // --------------------------------------------------------
        // GET APPROVED LEAVES
        // --------------------------------------------------------

        List<LeaveRequest> approvedRequests =
                leaveRequestRepository.findByStaffStaffIdAndStatus(
                        staffId,
                        "APPROVED"
                );


        // --------------------------------------------------------
        // CALCULATE USED LEAVES
        // --------------------------------------------------------

        int usedFullDayLeaves = 0;
        int usedShortLeaves = 0;

        int usedMonthlyFullDayLeaves = 0;
        int usedMonthlyShortLeaves = 0;

        LocalDate today = LocalDate.now();

        // First day of the current month
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);

        // Last day of the current month
        LocalDate lastDayOfMonth = today.withDayOfMonth(
                today.lengthOfMonth()
        );


        for (LeaveRequest request : approvedRequests) {

            // ====================================================
            // FULL DAY LEAVE
            // ====================================================

            if ("FULL_DAY".equals(request.getLeaveType())) {

                int days = request.getTotalDays() != null
                        ? request.getTotalDays()
                        : 0;

                // Add to yearly used full-day leave
                usedFullDayLeaves += days;


                // Check whether this leave overlaps with
                // the current month
                if (request.getStartDate() != null &&
                        request.getEndDate() != null) {

                    boolean overlapsCurrentMonth =
                            !request.getEndDate()
                                    .isBefore(firstDayOfMonth)
                                    &&
                                    !request.getStartDate()
                                            .isAfter(lastDayOfMonth);

                    if (overlapsCurrentMonth) {

                        LocalDate overlapStart =
                                request.getStartDate()
                                        .isAfter(firstDayOfMonth)
                                        ? request.getStartDate()
                                        : firstDayOfMonth;

                        LocalDate overlapEnd =
                                request.getEndDate()
                                        .isBefore(lastDayOfMonth)
                                        ? request.getEndDate()
                                        : lastDayOfMonth;

                        long overlappingDays =
                                ChronoUnit.DAYS.between(
                                        overlapStart,
                                        overlapEnd
                                ) + 1;

                        usedMonthlyFullDayLeaves +=
                                (int) overlappingDays;
                    }
                }
            }


            // ====================================================
            // SHORT LEAVE
            // ====================================================

            else if ("SHORT".equals(request.getLeaveType())) {

                // Every approved short-leave request uses
                // one short-leave allowance
                usedShortLeaves++;


                // Check monthly short-leave usage
                if (request.getStartDate() != null &&
                        !request.getStartDate()
                                .isBefore(firstDayOfMonth) &&
                        !request.getStartDate()
                                .isAfter(lastDayOfMonth)) {

                    usedMonthlyShortLeaves++;
                }
            }
        }


        // --------------------------------------------------------
        // CALCULATE REMAINING LEAVE
        // --------------------------------------------------------

        int fullDayRemaining =
                Math.max(
                        0,
                        balance.getFullDayTotal()
                                - usedFullDayLeaves
                );

        int shortLeaveRemaining =
                Math.max(
                        0,
                        balance.getShortLeaveTotal()
                                - usedShortLeaves
                );

        int monthlyFullDayRemaining =
                Math.max(
                        0,
                        balance.getMonthlyFullDayTotal()
                                - usedMonthlyFullDayLeaves
                );

        int monthlyShortLeaveRemaining =
                Math.max(
                        0,
                        balance.getMonthlyShortLeaveTotal()
                                - usedMonthlyShortLeaves
                );


        // --------------------------------------------------------
        // FIND UPCOMING APPROVED LEAVE
        // --------------------------------------------------------

        List<LeaveRequest> upcomingRequests =
                leaveRequestRepository
                        .findByStaffStaffIdAndStatusAndStartDateGreaterThanEqualOrderByStartDateAsc(
                                staffId,
                                "APPROVED",
                                today
                        );

        List<LocalDate> upcomingLeaveDays =
                new ArrayList<>();


        for (LeaveRequest request : upcomingRequests) {

            if (request.getStartDate() != null) {

                upcomingLeaveDays.add(
                        request.getStartDate()
                );
            }
        }


        // --------------------------------------------------------
        // RETURN SUMMARY
        // --------------------------------------------------------

        return new LeaveSummaryDTO(

                fullDayRemaining,
                balance.getFullDayTotal(),

                shortLeaveRemaining,
                balance.getShortLeaveTotal(),

                monthlyFullDayRemaining,
                balance.getMonthlyFullDayTotal(),

                monthlyShortLeaveRemaining,
                balance.getMonthlyShortLeaveTotal(),

                upcomingLeaveDays
        );
    }
}