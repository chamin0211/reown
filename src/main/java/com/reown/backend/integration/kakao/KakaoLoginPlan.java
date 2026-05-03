package com.reown.backend.integration.kakao;

/**
 * 카카오 로그인은 현재 구현 범위에서 제외하고, 나중에 OAuth2 방식으로 붙이기 위한 확장 메모입니다.
 * 현재 로그인 흐름은 DB 기반 /api/auth/signup, /api/auth/login 을 사용합니다.
 */
public final class KakaoLoginPlan {

    private KakaoLoginPlan() {
    }

    public static final String FUTURE_LOGIN_PATH = "/oauth2/authorization/kakao";
    public static final String FUTURE_SUCCESS_HANDLER = "OAuth2 로그인 성공 후 email 기준으로 user_member를 조회하거나 자동 가입 처리";
}
