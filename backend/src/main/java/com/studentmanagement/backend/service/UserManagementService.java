package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dto.ChangePasswordRequest;
import com.studentmanagement.backend.dto.CreateUserRequest;
import com.studentmanagement.backend.dto.UpdateProfileRequest;
import com.studentmanagement.backend.model.Role;
import com.studentmanagement.backend.model.Student;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.repository.RoleRepository;
import com.studentmanagement.backend.repository.StudentRepository;
import com.studentmanagement.backend.repository.UserRepository;
import jakarta.persistence.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentRepository studentRepository; // <--- Added Student Repository

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Column(name = "staff_id")
    @JsonProperty("staffId")
    private Integer staffId;

    // ---------- create user with student validation for parents ----------
    public User createUser(CreateUserRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        Role role = roleRepository.findByRoleName(request.role().trim().toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role selected"));

        List<Student> students = new ArrayList<>();
        if ("PARENT".equalsIgnoreCase(role.getRoleName()) && request.studentIds() != null && !request.studentIds().isEmpty()) {
            for (String studentIdStr : request.studentIds()) {
                String trimmedId = studentIdStr.trim();
                if (trimmedId.isEmpty()) continue;

                // Try exact match first (e.g. "101")
                Student student = studentRepository.findById(trimmedId).orElse(null);

                // If not found, try with "STU" prefix (e.g. "STU101")
                if (student == null) {
                    String prefixedId = "STU" + trimmedId.replaceAll("(?i)^STU", "");
                    student = studentRepository.findById(prefixedId).orElse(null);
                }

                if (student == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Student ID '" + trimmedId + "' does not exist in the database");
                }

                if (userRepository.existsByStudents_StudentId(student.getStudentId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Student ID '" + student.getStudentId() + "' is already linked to another parent account");
                }

                students.add(student);
            }
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setStatus("ACTIVE");

        if ("TEACHER".equalsIgnoreCase(role.getRoleName())) {
            Integer maxStaffId = userRepository.findMaxStaffId();
            int nextStaffId = (maxStaffId == null || maxStaffId < 0) ? 1 : maxStaffId + 1;
            user.setStaffId(nextStaffId);
        }

        if (!students.isEmpty()) {
            user.setStudents(students);
        }

        return userRepository.save(user);
    }

    // ---------- edit own details ----------
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
    }

    public User updateEmail(String username, UpdateProfileRequest request) {
        User user = getByUsername(username);
        verifyCurrentPassword(user, request.currentPassword());

        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCaseAndUserIdNot(email, user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        user.setEmail(email);
        return userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = getByUsername(username);
        verifyCurrentPassword(user, request.currentPassword());

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "New password must be different from the current password");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private void verifyCurrentPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!"ACTIVE".equalsIgnoreCase(status) && !"INACTIVE".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Invalid status value. Must be ACTIVE or INACTIVE.");
        }

        user.setStatus(status.toUpperCase());
        return userRepository.save(user);
    }
}