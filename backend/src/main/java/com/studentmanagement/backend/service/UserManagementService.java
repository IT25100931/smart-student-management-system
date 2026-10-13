package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dto.ChangePasswordRequest;
import com.studentmanagement.backend.dto.CreateUserRequest;
import com.studentmanagement.backend.dto.UpdateProfileRequest;
import com.studentmanagement.backend.model.Role;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.repository.RoleRepository;
import com.studentmanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- existing: create user ----------
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

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setStatus("ACTIVE");

        return userRepository.save(user);
    }

    // ---------- new: edit own details ----------
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
            // 400, not 401: the frontend treats 401 as "session expired"
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
    }
}