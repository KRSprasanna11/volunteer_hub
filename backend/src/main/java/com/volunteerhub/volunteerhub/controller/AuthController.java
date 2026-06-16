package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.LoginRequest;
import com.volunteerhub.volunteerhub.dto.LoginResponse;
import com.volunteerhub.volunteerhub.dto.RegisterRequest;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.service.EmailService;
import com.volunteerhub.volunteerhub.service.UserService;
import com.volunteerhub.volunteerhub.service.VolunteerProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3001")
public class AuthController {

    @Autowired
    private UserService userService;

    // ✅ Email Service Injection
    @Autowired
    private EmailService emailService;

    // ✅ Volunteer Profile Service Injection
    @Autowired
    private VolunteerProfileService volunteerProfileService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        userService.register(user);

        // ✅ SEND WELCOME EMAIL AFTER REGISTER
        emailService.sendEmail(
                user.getEmail(),
                "Welcome to VolunteerHub 🎉",
                "Hi " + user.getName() + ",\n\n" +
                        "You have successfully registered in VolunteerHub.\n\n" +
                        "Thank you for joining us!\n\n" +
                        "- VolunteerHub Team"
        );

        return ResponseEntity.ok("Registered successfully (Email Sent)");
    }

    // ================= LOGIN (FINAL – EMAIL ADDED) =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            User user = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }

            boolean profileCompleted = true;

            // ✅ Only volunteers need profile completion check
            if (user.getRole().name().equals("VOLUNTEER")) {
                profileCompleted = volunteerProfileService
                        .isProfileCompleted(user.getId());
            }

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getName(),
                    user.getRole().name(),
                    profileCompleted
            );

            // ✅ SEND LOGIN EMAIL ALERT
            emailService.sendEmail(
                    user.getEmail(),
                    "Login Alert - VolunteerHub 🔐",
                    "Hi " + user.getName() + ",\n\n" +
                            "You have successfully logged in to VolunteerHub.\n\n" +
                            "If this was not you, please contact support immediately.\n\n" +
                            "- VolunteerHub Team"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {

            if ("USER_BLOCKED".equals(ex.getMessage())) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("User is blocked");
            }

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error");
        }
    }
}
