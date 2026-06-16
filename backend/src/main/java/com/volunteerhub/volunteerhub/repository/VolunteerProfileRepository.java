package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.VolunteerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VolunteerProfileRepository
        extends JpaRepository<VolunteerProfile, Long> {

    // ✅ SINGLE SOURCE OF TRUTH
    // VolunteerProfile ↔ User (OneToOne)
    Optional<VolunteerProfile> findByUser_Id(Long userId);
}
