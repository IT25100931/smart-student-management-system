package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassScheduleRepository
        extends JpaRepository<ClassSchedule, Integer> {

    // Find all classes assigned to a particular staff member
    List<ClassSchedule> findByStaffStaffId(Integer staffId);

    // Find a staff member's classes for a particular day,
    // ordered by their starting time
    List<ClassSchedule> findByStaffStaffIdAndDayOfWeekIgnoreCaseOrderByStartTimeAsc(
            Integer staffId,
            String dayOfWeek
    );

    // Find all scheduled classes on a particular day,
    // ordered by their starting time
    List<ClassSchedule> findByDayOfWeekIgnoreCaseOrderByStartTimeAsc(
            String dayOfWeek
    );
}
