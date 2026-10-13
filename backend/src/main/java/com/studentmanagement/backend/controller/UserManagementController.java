package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.config.JwtUtil;
import com.studentmanagement.backend.dto.ChangePasswordRequest;
import com.studentmanagement.backend.dto.CreateUserRequest;
import com.studentmanagement.backend.dto.UpdateProfileRequest;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.service.TokenBlacklistService;
import com.studentmanagement.backend.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserManagementController {

    @Autowired
    private UserManagementService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    // ---------- existing: admin creates a user ----------
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User profile created successfully",
                "userId", user.getUserId(),
                "username", user.getUsername(),
                "role", user.getRole().getRoleName()
        ));
    }

    // ---------- new: the logged-in user's own account ----------
    @GetMapping("/me")
    public Map<String, Object> me(@RequestAttribute("authUsername") String username) {
        User user = userService.getByUsername(username);
        return Map.of(
                "username", user.getUsername(),
                "email", user.getEmail() == null ? "" : user.getEmail(),
                "role", user.getRole().getRoleName()
        );
    }

    @PutMapping("/me")
    public Map<String, Object> updateMe(@RequestAttribute("authUsername") String username,
                                        @Valid @RequestBody UpdateProfileRequest request) {
        User user = userService.updateEmail(username, request);
        return Map.of("message", "Details updated successfully", "email", user.getEmail());
    }

    @PutMapping("/me/password")
    public Map<String, Object> changePassword(@RequestAttribute("authUsername") String username,
                                              @RequestHeader("Authorization") String authHeader,
                                              @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(username, request);

        // End this session so the user signs in again with the new password
        String token = authHeader.substring(7);
        tokenBlacklistService.revoke(jwtUtil.extractTokenId(token), jwtUtil.extractExpiration(token));

        return Map.of("message", "Password changed. Please log in again.");
    }

    // ---------- Get all users ----------
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> response = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", user.getUserId());
            map.put("username", user.getUsername());
            map.put("email", user.getEmail() == null ? "" : user.getEmail());
            map.put("role", user.getRole() != null ? user.getRole().getRoleName() : "");
            map.put("status", user.getStatus() == null ? "ACTIVE" : user.getStatus());
            map.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
            map.put("staffId", user.getStaffId()); // Safe for nulls (non-teachers)
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    // ---------- Toggle user status (ACTIVE / INACTIVE) ----------
    @PutMapping("/{userId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable Long userId,
                                                            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        User updatedUser = userService.updateUserStatus(userId, newStatus);

        return ResponseEntity.ok(Map.of(
                "message", "User status updated successfully",
                "userId", updatedUser.getUserId(),
                "status", updatedUser.getStatus()
        ));
    }
}