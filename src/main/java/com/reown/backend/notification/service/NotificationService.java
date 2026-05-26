package com.reown.backend.notification.service;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.notification.dto.NotificationResponse;
import com.reown.backend.notification.entity.UserNotification;
import com.reown.backend.notification.repository.UserNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final UserNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public void notifyUser(Long userId, String title, String message, String type, String linkUrl) {
        if (userId == null || !userRepository.existsById(userId)) {
            return;
        }

        notificationRepository.save(new UserNotification(
                userId,
                normalize(title, "새 알림"),
                normalize(message, "새로운 알림이 도착했습니다."),
                normalize(type, "INFO"),
                normalizeNullable(linkUrl)
        ));
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void notifyRoles(Collection<UserRole> roles, String title, String message, String type, String linkUrl) {
        if (roles == null || roles.isEmpty()) {
            return;
        }

        userRepository.findByRoleIn(List.copyOf(roles))
                .forEach(user -> notificationRepository.save(new UserNotification(
                        user.getUserId(),
                        normalize(title, "새 알림"),
                        normalize(message, "새로운 알림이 도착했습니다."),
                        normalize(type, "INFO"),
                        normalizeNullable(linkUrl)
                )));
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void notifyAdmins(String title, String message, String type, String linkUrl) {
        notifyRoles(List.of(UserRole.ADMIN, UserRole.MASTER), title, message, type, linkUrl);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void notifyMasters(String title, String message, String type, String linkUrl) {
        notifyRoles(List.of(UserRole.MASTER), title, message, type, linkUrl);
    }

    public List<NotificationResponse> getNotifications(Long userId, boolean unreadOnly) {
        assertUserExists(userId);

        List<UserNotification> notifications = unreadOnly
                ? notificationRepository.findTop50ByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                : notificationRepository.findTop50ByUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public Map<String, Long> getUnreadCount(Long userId) {
        assertUserExists(userId);
        return Map.of("count", notificationRepository.countByUserIdAndReadFalse(userId));
    }

    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        assertUserExists(userId);
        UserNotification notification = notificationRepository.findByNotificationIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다. notificationId=" + notificationId));

        notification.markAsRead();
        return NotificationResponse.from(notification);
    }

    @Transactional
    public Map<String, Integer> markAllAsRead(Long userId) {
        assertUserExists(userId);
        List<UserNotification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        unreadNotifications.forEach(UserNotification::markAsRead);
        return Map.of("updated", unreadNotifications.size());
    }

    private void assertUserExists(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("로그인 사용자 정보가 없습니다.");
        }
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다. userId=" + userId);
        }
    }

    private String normalize(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
