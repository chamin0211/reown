package com.reown.backend.auth.dto;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;

public record AuthResponse(
        Long userId,
        String email,
        String nickname,
        UserRole role
) {
    public static AuthResponse from(User user) {
        return new AuthResponse(
                user.getUserId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole()
        );
    }
}
