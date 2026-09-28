package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Integer> {

    List<LeaveRequest> findByStaffStaffId(Integer staffId);

    List<LeaveRequest> findByStaffStaffIdAndStatus(
            Integer staffId,
            String status
    );

    List<LeaveRequest> findByStaffStaffIdAndStatusAndStartDateGreaterThanEqualOrderByStartDateAsc(
            Integer staffId,
            String status,
            LocalDate startDate
    );
}
