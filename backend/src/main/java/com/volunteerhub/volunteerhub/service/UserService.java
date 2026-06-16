package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.VolunteerProfileDTO;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ SINGLE, CORRECT CONSTRUCTOR
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= AUTH =================

    // ✅ REGISTER
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ LOGIN (BLOCK-AWARE, ENTITY-SAFE)
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        // 🔒 BLOCK CHECK
        if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("USER_BLOCKED");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        // ❌ DO NOT MODIFY ENTITY HERE
        // ❌ DO NOT set password to null
        return user;
    }

    // ✅ CHECK EMAIL EXISTS
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // ================= VOLUNTEER PROFILE =================

    public VolunteerProfileDTO getVolunteerProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VolunteerProfileDTO dto = new VolunteerProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        return dto;
    }

    public void updateVolunteerProfile(Long userId, VolunteerProfileDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());

        userRepository.save(user);
    }
}
