package com.reown.backend.notification.repository;

import com.reown.backend.notification.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);
    List<UserNotification> findTop50ByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);
    List<UserNotification> findByUserIdAndReadFalse(Long userId);
    Optional<UserNotification> findByNotificationIdAndUserId(Long notificationId, Long userId);
    long countByUserIdAndReadFalse(Long userId);
}
