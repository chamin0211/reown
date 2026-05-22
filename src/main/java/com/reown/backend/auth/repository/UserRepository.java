package com.reown.backend.auth.repository;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByLoginId(String loginId);

    boolean existsByEmail(String email);
    boolean existsByLoginId(String loginId);

    List<User> findByRole(UserRole role);
    List<User> findByRoleIn(List<UserRole> roles);
}
