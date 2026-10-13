package com.studentmanagement.backend.config;

import com.studentmanagement.backend.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // CORS preflight requests carry no token: let them through
        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Login is the only endpoint that works without a token
        if (path.equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
            return;
        }

        String tokenId = jwtUtil.extractTokenId(token);
        if (tokenId == null || tokenBlacklistService.isRevoked(tokenId)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token has been revoked. Please log in again.");
            return;
        }

        String role = jwtUtil.extractRole(token);

        if (!isAllowed(path, method, role)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("You do not have permission to perform this action");
            return;
        }

        // Lets controllers know who is calling, taken from the verified token
        request.setAttribute("authUsername", jwtUtil.extractUsername(token));
        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(String path, String method, String role) {
        // Student records: only admins create or edit
        if (path.startsWith("/students") && (method.equals("POST") || method.equals("PUT"))) {
            return "ADMIN".equals(role);
        }

        // Payments (specific rules first)
        if (path.equals("/api/payments/submit-slip")) return "PARENT".equals(role);
        if (path.equals("/api/payments/verify"))      return "ADMIN".equals(role);
        if (path.equals("/api/payments/slip-file"))   return "ADMIN".equals(role);
        if (path.startsWith("/api/payments"))         return "ADMIN".equals(role) || "PARENT".equals(role);

        // Users: any logged-in user may manage their OWN account (identity comes from the token)...
        if (path.equals("/api/users/me") || path.equals("/api/users/me/password")) return true;
        // ...but only admins may create accounts or use any other /api/users endpoint
        if (path.startsWith("/api/users")) return "ADMIN".equals(role);

        return true; // any other endpoint: any authenticated user
    }
}