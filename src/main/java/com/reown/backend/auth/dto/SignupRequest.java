package com.reown.backend.auth.dto;

import com.reown.backend.auth.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotBlank String nickname,
        UserRole role
) {
}
