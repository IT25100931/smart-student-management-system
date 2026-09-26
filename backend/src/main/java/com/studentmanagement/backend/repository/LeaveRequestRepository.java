package com.studentmanagement.backend.repository;
import com.studentmanagement.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Integer> {
    List<LeaveRequest> findByStaffStaffId(Integer staffId);
}
