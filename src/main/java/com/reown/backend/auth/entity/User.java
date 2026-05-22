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

    /**
     * 기존 코드와 카카오 로그인 코드 호환용 생성자입니다.
     * 새 일반 회원가입은 loginId를 직접 받는 생성자를 사용합니다.
     */
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
