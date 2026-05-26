package com.reown.backend.notification.dto;

import com.reown.backend.notification.entity.UserNotification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long notificationId,
        String title,
        String message,
        String type,
        String linkUrl,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(UserNotification notification) {
        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getLinkUrl(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
