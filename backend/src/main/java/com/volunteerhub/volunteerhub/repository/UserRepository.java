package com.volunteerhub.volunteerhub.repository;

import com.volunteerhub.volunteerhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Find user by email (used for login / validation)
    Optional<User> findByEmail(String email);

    // ✅ Find users by role
    List<User> findByRole(String role);

    // ✅ Find users by status
    List<User> findByStatus(String status);
}
