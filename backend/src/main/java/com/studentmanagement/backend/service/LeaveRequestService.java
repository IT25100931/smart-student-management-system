package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.LeaveRequest;
import com.studentmanagement.backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getLeaveRequestsByStaff(Integer staffId) {
        return leaveRequestRepository.findByStaffStaffId(staffId);
    }

    public LeaveRequest getLeaveRequestById(Integer id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
    }
}