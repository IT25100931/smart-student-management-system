package com.studentmanagement.backend.repository;
import com.studentmanagement.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Integer> {
}
