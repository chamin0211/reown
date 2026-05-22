package com.reown.backend.auth.dto;

import com.reown.backend.auth.entity.UserRole;
import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
        // 신규 회원가입 필드입니다. 이메일 대신 사용자가 직접 아이디를 만듭니다.
        String loginId,

        // 기존 데이터/카카오 로그인/이전 API 호환용입니다. 새 화면에서는 필수 입력이 아닙니다.
        String email,

        @NotBlank String password,
        @NotBlank String nickname,

        // 기존 회원가입 API와의 호환용입니다. 신규 프론트에서는 accountType을 사용합니다.
        UserRole role,

        // USER / SELLER / ADMIN 중 하나입니다.
        // SELLER는 SELLER_PENDING으로 가입되고, 관리자 입점 승인 후 SELLER가 됩니다.
        // ADMIN은 ADMIN_PENDING으로 가입되고, MASTER 승인 후 ADMIN이 됩니다.
        String accountType,

        // SELLER 회원가입 시 입점 심사 신청으로 같이 저장되는 브랜드 정보입니다.
        String brandName,
        String brandLogoUrl,
        String businessNumber,
        String settlementCycle,

        // 이전 초대 코드 방식과의 호환을 위해 남겨둔 필드입니다.
        String adminCode
) {
}
