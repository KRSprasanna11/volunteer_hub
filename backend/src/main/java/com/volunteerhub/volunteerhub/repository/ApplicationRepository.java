package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Get all applications of a volunteer
    List<Application> findByVolunteerId(Long volunteerId);

    // Get applications of a volunteer by status
    List<Application> findByVolunteerIdAndStatus(Long volunteerId, String status);

    // Get a specific application by volunteer and event
    Optional<Application> findByVolunteerIdAndEventId(Long volunteerId, Long eventId);
}
