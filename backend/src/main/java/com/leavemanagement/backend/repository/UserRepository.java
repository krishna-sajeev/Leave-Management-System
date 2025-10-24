package com.leavemanagement.backend.repository;

import com.leavemanagement.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findById(Long userId);

    Optional<User> findByUserId(String userId);

    List<User> findByRole(User.Role role);
}
