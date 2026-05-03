package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.AuthResponse;
import com.reown.backend.auth.dto.LoginRequest;
import com.reown.backend.auth.dto.SignupRequest;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        UserRole role = request.role() != null ? request.role() : UserRole.USER;
        User user = new User(request.email(), request.password(), request.nickname(), role);

        return AuthResponse.from(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다."));

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        return AuthResponse.from(user);
    }
}
