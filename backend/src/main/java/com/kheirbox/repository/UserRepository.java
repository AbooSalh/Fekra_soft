package com.kheirbox.repository;

import com.kheirbox.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.UserRole role);
    List<User> findByStatus(User.AccountStatus status);
    List<User> findByRoleAndStatus(User.UserRole role, User.AccountStatus status);
    Boolean existsByEmail(String email);
}
