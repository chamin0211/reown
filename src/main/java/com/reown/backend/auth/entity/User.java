package com.reown.backend.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Locale;

@Entity
@Table(name = "user_member")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "login_id", nullable = false, unique = true, length = 50)
    private String loginId;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Column(name = "failed_login_count", nullable = false)
    private int failedLoginCount;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public User(String loginId, String email, String password, String nickname, UserRole role) {
        this.loginId = normalizeLoginId(loginId);
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.failedLoginCount = 0;
        this.createdAt = LocalDateTime.now();
    }

    public User(String email, String password, String nickname, UserRole role) {
        this(resolveLoginIdFromEmail(email), email, password, nickname, role);
    }

    public void changeRole(UserRole role) {
        this.role = role;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void recordLoginFailure(LocalDateTime lockedUntil) {
        this.failedLoginCount += 1;
        this.lockedUntil = lockedUntil;
    }

    public void resetLoginFailure() {
        this.failedLoginCount = 0;
        this.lockedUntil = null;
    }

    public void markLoginSuccess() {
        this.lastLoginAt = LocalDateTime.now();
        resetLoginFailure();
    }

    public boolean isLocked(LocalDateTime now) {
        return lockedUntil != null && lockedUntil.isAfter(now);
    }

    public void lockUntil(LocalDateTime lockedUntil) {
        this.lockedUntil = lockedUntil;
        if (this.failedLoginCount < 5) {
            this.failedLoginCount = 5;
        }
    }

    public void unlockAccount() {
        resetLoginFailure();
    }

    private static String resolveLoginIdFromEmail(String email) {
        if (email == null || email.isBlank()) {
            return "user" + System.currentTimeMillis();
        }
        int atIndex = email.indexOf('@');
        String candidate = atIndex > 0 ? email.substring(0, atIndex) : email;
        return normalizeLoginId(candidate.replaceAll("[^a-zA-Z0-9_]", "_"));
    }

    private static String normalizeLoginId(String loginId) {
        return loginId == null ? null : loginId.trim().toLowerCase(Locale.ROOT);
    }
}
