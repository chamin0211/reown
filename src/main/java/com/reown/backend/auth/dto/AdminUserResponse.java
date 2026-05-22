package com.reown.backend.auth.dto;

import com.reown.backend.auth.entity.User;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long userId,
        String loginId,
        String email,
        String nickname,
        String role,
        int failedLoginCount,
        LocalDateTime lockedUntil,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getUserId(),
                user.getLoginId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole().name(),
                user.getFailedLoginCount(),
                user.getLockedUntil(),
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}
