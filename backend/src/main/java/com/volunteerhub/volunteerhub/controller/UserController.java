package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.VolunteerProfileDTO;
import com.volunteerhub.volunteerhub.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3001")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ GET PROFILE
    @GetMapping("/volunteer/{id}")
    public VolunteerProfileDTO getProfile(@PathVariable Long id) {
        return userService.getVolunteerProfile(id);
    }

    // ✅ UPDATE PROFILE
    @PutMapping("/volunteer/{id}")
    public void updateProfile(
            @PathVariable Long id,
            @RequestBody VolunteerProfileDTO dto
    ) {
        userService.updateVolunteerProfile(id, dto);
    }
}
