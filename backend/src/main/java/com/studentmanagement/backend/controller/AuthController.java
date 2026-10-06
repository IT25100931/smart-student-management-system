package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.config.JwtUtil;
import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

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
}