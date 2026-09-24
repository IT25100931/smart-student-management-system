package com.studentmanagement.backend.repository;
import com.studentmanagement.backend.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Integer> {
}

