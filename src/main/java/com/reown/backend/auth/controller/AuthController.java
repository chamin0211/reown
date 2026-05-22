package com.reown.backend.auth.controller;

import com.reown.backend.auth.dto.AuthResponse;
import com.reown.backend.auth.dto.KakaoLoginRequest;
import com.reown.backend.auth.dto.LoginRequest;
import com.reown.backend.auth.dto.SignupRequest;
import com.reown.backend.auth.service.AuthService;
import com.reown.backend.auth.service.KakaoLoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final KakaoLoginService kakaoLoginService;

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/check-login-id")
    public Map<String, Boolean> checkLoginId(@RequestParam String loginId) {
        return Map.of("available", authService.isLoginIdAvailable(loginId));
    }

    @PostMapping("/kakao")
    public AuthResponse kakaoLogin(@Valid @RequestBody KakaoLoginRequest request) {
        return kakaoLoginService.login(request.code());
    }

    @GetMapping("/kakao/callback")
    public AuthResponse kakaoCallback(@RequestParam String code) {
        return kakaoLoginService.login(code);
    }
}
