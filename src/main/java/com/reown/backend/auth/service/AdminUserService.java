package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.AdminUserResponse;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<AdminUserResponse> getUsers(String role) {
        UserRole resolvedRole = resolveRole(role);
        List<User> users = resolvedRole == null
                ? userRepository.findAll()
                : userRepository.findByRole(resolvedRole);

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
        notificationService.notifyUser(
                user.getUserId(),
                "관리자 승인 완료",
                "관리자 신청이 승인되었습니다. 이제 관리자 페이지를 사용할 수 있습니다.",
                "ADMIN_APPROVED",
                "/admin"
        );
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse rejectAdmin(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.ADMIN_PENDING) {
            throw new IllegalArgumentException("관리자 승인 대기 계정만 반려할 수 있습니다.");
        }

        user.changeRole(UserRole.USER);
        notificationService.notifyUser(
                user.getUserId(),
                "관리자 신청 반려",
                "관리자 신청이 반려되었습니다. 일반 사용자 계정으로 이용할 수 있습니다.",
                "ADMIN_REJECTED",
                "/"
        );
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse grantMaster(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("승인된 관리자만 MASTER로 승격할 수 있습니다.");
        }

        user.changeRole(UserRole.MASTER);
        notificationService.notifyUser(
                user.getUserId(),
                "MASTER 권한 부여",
                "최고 관리자 권한이 부여되었습니다.",
                "MASTER_GRANTED",
                "/admin/settings/admins"
        );
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse revokeMaster(Long userId) {
        User user = getUser(userId);
        if (user.getRole() != UserRole.MASTER) {
            throw new IllegalArgumentException("MASTER 계정만 일반 관리자로 변경할 수 있습니다.");
        }

        user.changeRole(UserRole.ADMIN);
        notificationService.notifyUser(
                user.getUserId(),
                "MASTER 권한 회수",
                "MASTER 권한이 일반 관리자 권한으로 변경되었습니다.",
                "MASTER_REVOKED",
                "/admin"
        );
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse changeRole(Long userId, String role) {
        User user = getUser(userId);
        UserRole targetRole = resolveRole(role);
        if (targetRole == null) {
            throw new IllegalArgumentException("변경할 권한을 선택해주세요.");
        }
        user.changeRole(targetRole);
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse lockUser(Long userId, Integer days) {
        User user = getUser(userId);
        int lockDays = days == null || days < 1 ? 7 : Math.min(days, 365);
        user.lockUntil(LocalDateTime.now().plusDays(lockDays));
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse unlockUser(Long userId) {
        User user = getUser(userId);
        user.unlockAccount();
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
