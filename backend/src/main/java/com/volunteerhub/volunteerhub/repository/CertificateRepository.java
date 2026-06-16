package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    // ✅ Check if certificate already generated for volunteer + event
    Optional<Certificate> findByVolunteerIdAndEventId(Long volunteerId, Long eventId);

    // ✅ Volunteer can view all certificates
    List<Certificate> findByVolunteerId(Long volunteerId);
}
