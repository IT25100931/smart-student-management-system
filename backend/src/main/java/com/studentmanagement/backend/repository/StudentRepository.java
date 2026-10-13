package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> {

    // Finds the highest existing student_id, e.g. "STU1005", so we know what number comes next
    @Query("SELECT s.studentId FROM Student s ORDER BY s.studentId DESC LIMIT 1")
    Optional<String> findTopStudentId();

    List<Student> findByStatus(String status);
}