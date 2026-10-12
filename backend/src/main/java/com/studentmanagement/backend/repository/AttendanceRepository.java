package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByStudent_StudentIdAndWeekEndDate(String studentId, LocalDate weekEndDate);

    List<Attendance> findByWeekEndDateBetween(LocalDate from, LocalDate to);

    List<Attendance> findByStudent_StudentIdOrderByWeekEndDateDesc(String studentId);
}