package com.volunteerhub.volunteerhub.controller;

import com.volunteerhub.volunteerhub.dto.VolunteerProfileDTO;
import com.volunteerhub.volunteerhub.dto.VolunteerProfileUpdateDTO;
import com.volunteerhub.volunteerhub.service.VolunteerProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/volunteer/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // ✅ FIX
public class VolunteerProfileController {

    private final VolunteerProfileService service;

    // ✅ CONSTRUCTOR INJECTION (VERY IMPORTANT)
    public VolunteerProfileController(VolunteerProfileService service) {
        this.service = service;
    }

    // ================= GET PROFILE =================
    @GetMapping("/{volunteerId}")
    public VolunteerProfileDTO getProfile(
            @PathVariable Long volunteerId
    ) {
        return service.getProfile(volunteerId);
    }

    // ================= SAVE / UPDATE PROFILE =================
    @PutMapping("/{volunteerId}")
    public void saveOrUpdateProfile(
            @PathVariable Long volunteerId,
            @RequestBody VolunteerProfileDTO dto
    ) {
        service.saveOrUpdateProfile(volunteerId, dto);
    }

    // ================= PARTIAL UPDATE (LEGACY SUPPORT) =================
    @PutMapping("/{userId}/update")
    public void updateProfile(
            @PathVariable Long userId,
            @RequestBody VolunteerProfileUpdateDTO dto
    ) {
        service.updateProfile(userId, dto);
    }
}
