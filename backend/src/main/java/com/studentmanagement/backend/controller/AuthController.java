package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.config.JwtUtil;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.service.AuthService;
import com.studentmanagement.backend.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = authService.login(username, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getRoleName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("role", user.getRole().getRoleName());
            response.put("username", user.getUsername());
            response.put("staffId", user.getStaffId()); // Will be null for non-teachers

            return response;
        }
        return Map.of("success", false, "message", "Invalid username or password");
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // strip "Bearer "
        tokenBlacklistService.revoke(
                jwtUtil.extractTokenId(token),
                jwtUtil.extractExpiration(token)
        );
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }
}