package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndUserIdNot(String email, Long userId);
    boolean existsByStudents_StudentId(String studentId);

    @Query("SELECT MAX(u.staffId) FROM User u")
    Integer findMaxStaffId();
}