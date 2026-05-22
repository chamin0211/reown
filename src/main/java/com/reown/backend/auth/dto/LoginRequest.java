package com.reown.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        // 신규 로그인 필드입니다. 이메일 대신 아이디로 로그인합니다.
        String loginId,

        // 기존 프론트/테스트 요청과의 호환용입니다. 새 화면에서는 사용하지 않습니다.
        String email,

        @NotBlank String password
) {
}
