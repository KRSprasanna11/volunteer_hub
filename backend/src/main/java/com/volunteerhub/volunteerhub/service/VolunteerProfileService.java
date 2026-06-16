package com.volunteerhub.volunteerhub.service;

import com.volunteerhub.volunteerhub.dto.VolunteerProfileDTO;
import com.volunteerhub.volunteerhub.dto.VolunteerProfileUpdateDTO;
import com.volunteerhub.volunteerhub.model.Skill;
import com.volunteerhub.volunteerhub.model.User;
import com.volunteerhub.volunteerhub.model.VolunteerProfile;
import com.volunteerhub.volunteerhub.repository.SkillRepository;
import com.volunteerhub.volunteerhub.repository.UserRepository;
import com.volunteerhub.volunteerhub.repository.VolunteerProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VolunteerProfileService {

    private final VolunteerProfileRepository volunteerProfileRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public VolunteerProfileService(
            VolunteerProfileRepository volunteerProfileRepository,
            SkillRepository skillRepository,
            UserRepository userRepository
    ) {
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // ================= GET PROFILE =================
    public VolunteerProfileDTO getProfile(Long userId) {

        VolunteerProfile profile =
                volunteerProfileRepository.findByUser_Id(userId).orElse(null);

        VolunteerProfileDTO dto = new VolunteerProfileDTO();

        if (profile == null) {
            return dto;
        }

        dto.setOccupation(profile.getOccupation());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setState(profile.getState());
        dto.setGender(profile.getGender());
        dto.setAge(profile.getAge());
        dto.setAvailability(profile.getAvailability());

        // ✅ Fetch skills correctly
        List<String> skills = skillRepository
                .findByVolunteerProfile(profile)
                .stream()
                .map(Skill::getName)
                .collect(Collectors.toList());

        dto.setSkills(skills);

        return dto;
    }

    // ================= SAVE / UPDATE PROFILE =================
    public void saveOrUpdateProfile(Long userId, VolunteerProfileDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Ensure profile exists
        VolunteerProfile profile =
                volunteerProfileRepository.findByUser_Id(userId)
                        .orElseGet(() -> {
                            VolunteerProfile p = new VolunteerProfile();
                            p.setUser(user);
                            return volunteerProfileRepository.save(p);
                        });

        // ✅ Update profile fields
        profile.setOccupation(dto.getOccupation());
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setGender(dto.getGender());
        profile.setAge(dto.getAge());
        profile.setAvailability(dto.getAvailability());

        // ✅ FIX: Update profileCompleted properly
        boolean completed =
                dto.getOccupation() != null &&
                        dto.getGender() != null &&
                        dto.getAge() != null &&
                        dto.getAddress() != null &&
                        dto.getCity() != null &&
                        dto.getState() != null;

        profile.setProfileCompleted(completed);

        volunteerProfileRepository.save(profile);

        // ================= SKILLS UPDATE =================
        if (dto.getSkills() != null) {

            // ✅ FINAL FIX: Delete old skills directly (No Hibernate conflict)
            skillRepository.deleteByVolunteerProfile(profile);

            // ✅ Save new skills (ignore empty values)
            for (String skillName : dto.getSkills()) {

                if (skillName == null || skillName.trim().isEmpty()) continue;

                Skill skill = new Skill();
                skill.setName(skillName);
                skill.setVolunteerProfile(profile);
                skillRepository.save(skill);
            }
        }
    }

    // ================= PARTIAL UPDATE (LEGACY SUPPORT) =================
    public void updateProfile(Long userId, VolunteerProfileUpdateDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VolunteerProfile profile =
                volunteerProfileRepository.findByUser_Id(userId)
                        .orElseGet(() -> {
                            VolunteerProfile p = new VolunteerProfile();
                            p.setUser(user);
                            return p;
                        });

        profile.setOccupation(dto.getOccupation());
        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setGender(dto.getGender());
        profile.setAge(dto.getAge());
        profile.setAvailability(dto.getAvailability());

        boolean completed =
                dto.getOccupation() != null &&
                        dto.getGender() != null &&
                        dto.getAge() != null &&
                        dto.getAddress() != null &&
                        dto.getCity() != null &&
                        dto.getState() != null;

        profile.setProfileCompleted(completed);
        volunteerProfileRepository.save(profile);

        // ===== LEGACY SKILL FLOW =====
        if (user.getSkills() == null) {
            user.setSkills(new ArrayList<>());
        } else {
            user.getSkills().clear();
        }

        if (dto.getSkills() != null) {
            for (String skillName : dto.getSkills()) {

                if (skillName == null || skillName.trim().isEmpty()) continue;

                Skill skill = skillRepository.findByName(skillName)
                        .orElseThrow(() ->
                                new RuntimeException("Skill not found: " + skillName)
                        );
                user.getSkills().add(skill);
            }
        }

        userRepository.save(user);
    }

    // ================= PROFILE COMPLETION STATUS =================
    public boolean isProfileCompleted(Long userId) {
        return volunteerProfileRepository.findByUser_Id(userId)
                .map(VolunteerProfile::isProfileCompleted)
                .orElse(false);
    }
}
