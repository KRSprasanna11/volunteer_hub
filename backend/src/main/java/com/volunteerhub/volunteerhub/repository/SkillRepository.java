package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.Skill;
import com.volunteerhub.volunteerhub.model.VolunteerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // 🔥 REQUIRED FOR SPRING
public interface SkillRepository extends JpaRepository<Skill, Long> {

    // ================= LEGACY SUPPORT =================
    // Used in updateProfile(userId, VolunteerProfileUpdateDTO)
    Optional<Skill> findByName(String name);

    // ================= NEW PROFILE-BASED FLOW =================
    // Get skills for a specific volunteer profile
    List<Skill> findByVolunteerProfile(VolunteerProfile profile);

    // Delete skills when updating profile
    void deleteByVolunteerProfile(VolunteerProfile profile);
}
