package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.model.User;
import com.studentmanagement.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")  // temporary - loosens CORS while frontend isn't finalized
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> user = authService.login(username, password);
        if (user.isPresent()) {
            return Map.of(
                    "success", true,
                    "role", user.get().getRole().toString(),
                    "username", user.get().getUsername()
            );
        }
        return Map.of("success", false, "message", "Invalid username or password");
    }
}