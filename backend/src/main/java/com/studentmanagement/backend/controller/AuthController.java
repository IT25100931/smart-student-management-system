package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.config.JwtUtil;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import com.studentmanagement.backend.service.TokenBlacklistService;
import org.springframework.http.ResponseEntity;

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

            return Map.of(
                    "success", true,
                    "token", token,
                    "role", user.getRole().getRoleName(),
                    "username", user.getUsername()
            );
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