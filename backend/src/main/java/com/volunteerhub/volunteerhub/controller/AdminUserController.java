package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3001")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔹 Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔹 Filter by role
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userRepository.findByRole(role.toUpperCase());
    }

    // 🔹 Block / Unblock user
    @PutMapping("/{id}/status")
    public User updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus(status.toUpperCase());
        return userRepository.save(user);
    }
}
