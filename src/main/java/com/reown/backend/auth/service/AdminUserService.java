package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.AdminUserResponse;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;

    public List<AdminUserResponse> getUsers(String role) {
        List<User> users = resolveRole(role) == null
                ? userRepository.findAll()
                : userRepository.findByRole(resolveRole(role));

        return users.stream()
                .sorted(Comparator.comparing(User::getUserId).reversed())
                .map(AdminUserResponse::from)
                .toList();
    }

    public List<AdminUserResponse> getAdminApplications() {
        return userRepository.findByRole(UserRole.ADMIN_PENDING)
                .stream()
                .sorted(Comparator.comparing(User::getUserId).reversed())
                .map(AdminUserResponse::from)
                .toList();
    }

    @Transactional
    public AdminUserResponse approveAdmin(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.ADMIN_PENDING) {
            throw new IllegalArgumentException("관리자 승인 대기 계정만 승인할 수 있습니다.");
        }

        user.changeRole(UserRole.ADMIN);
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse rejectAdmin(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.ADMIN_PENDING) {
            throw new IllegalArgumentException("관리자 승인 대기 계정만 반려할 수 있습니다.");
        }

        // 계정을 삭제하지 않고 일반 사용자로 되돌려 재가입/로그인 문제를 줄입니다.
        user.changeRole(UserRole.USER);
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse grantMaster(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("승인된 관리자만 MASTER로 승격할 수 있습니다.");
        }

        user.changeRole(UserRole.MASTER);
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse revokeMaster(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.MASTER) {
            throw new IllegalArgumentException("MASTER 계정만 일반 관리자로 변경할 수 있습니다.");
        }

        user.changeRole(UserRole.ADMIN);
        return AdminUserResponse.from(user);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. userId=" + userId));
    }

    private UserRole resolveRole(String role) {
        if (role == null || role.trim().isEmpty() || "ALL".equalsIgnoreCase(role.trim())) {
            return null;
        }
        return UserRole.valueOf(role.trim().toUpperCase(Locale.ROOT));
    }
}
