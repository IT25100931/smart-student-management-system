package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.model.AttendanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceSummaryRepository extends JpaRepository<AttendanceSummary, Long> {

    Optional<AttendanceSummary> findByStudent_StudentIdAndYearAndMonth(String studentId, int year, int month);

    List<AttendanceSummary> findByYearAndMonth(int year, int month);

    List<AttendanceSummary> findByStudent_StudentIdOrderByYearDescMonthDesc(String studentId);
}