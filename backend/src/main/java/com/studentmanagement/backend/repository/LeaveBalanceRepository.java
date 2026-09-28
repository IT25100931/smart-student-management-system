package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Integer> {

    Optional<LeaveBalance> findByStaffStaffIdAndAcademicYear(
            Integer staffId,
            Integer academicYear
    );
}

