package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.AuthResponse;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KakaoLoginService {

    private final UserRepository userRepository;
    private final RestClient restClient = RestClient.create();

    @Value("${kakao.client-id:}")
    private String clientId;

    @Value("${kakao.redirect-uri:}")
    private String redirectUri;

    @Value("${kakao.client-secret:}")
    private String clientSecret;

    @Transactional
    public AuthResponse login(String code) {
        if (isBlank(clientId) || isBlank(redirectUri)) {
            throw new IllegalStateException("카카오 로그인 환경변수가 설정되지 않았습니다. KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI를 확인하세요.");
        }

        String accessToken = requestAccessToken(code);
        KakaoUserInfo kakaoUserInfo = requestUserInfo(accessToken);

        User user = userRepository.findByEmail(kakaoUserInfo.email())
                .orElseGet(() -> userRepository.save(new User(
                        kakaoUserInfo.loginId(),
                        kakaoUserInfo.email(),
                        "KAKAO_LOGIN",
                        kakaoUserInfo.nickname(),
                        UserRole.USER
                )));

        user.markLoginSuccess();
        return AuthResponse.from(user);
    }

    private String requestAccessToken(String code) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        form.add("redirect_uri", redirectUri);
        form.add("code", code);
        if (!isBlank(clientSecret)) {
            form.add("client_secret", clientSecret);
        }

        Map response = restClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(Map.class);

        Object accessToken = response != null ? response.get("access_token") : null;
        if (accessToken == null) {
            throw new IllegalStateException("카카오 access token을 발급받지 못했습니다.");
        }

        return accessToken.toString();
    }

    private KakaoUserInfo requestUserInfo(String accessToken) {
        Map response = restClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(Map.class);

        if (response == null || response.get("id") == null) {
            throw new IllegalStateException("카카오 사용자 정보를 조회하지 못했습니다.");
        }

        String kakaoId = response.get("id").toString();
        Map kakaoAccount = (Map) response.get("kakao_account");
        Map profile = kakaoAccount != null ? (Map) kakaoAccount.get("profile") : null;

        String email = kakaoAccount != null && kakaoAccount.get("email") != null
                ? kakaoAccount.get("email").toString()
                : "kakao_" + kakaoId + "@kakao.reown.local";

        String nickname = profile != null && profile.get("nickname") != null
                ? profile.get("nickname").toString()
                : "카카오사용자" + kakaoId;

        return new KakaoUserInfo("kakao_" + kakaoId, email, nickname);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record KakaoUserInfo(String loginId, String email, String nickname) {
    }
}
