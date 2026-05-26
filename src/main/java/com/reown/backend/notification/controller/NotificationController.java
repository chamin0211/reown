package com.reown.backend.notification.controller;

import com.reown.backend.notification.dto.NotificationResponse;
import com.reown.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getNotifications(
            @RequestHeader("X-Actor-User-Id") Long actorUserId,
            @RequestParam(defaultValue = "false") boolean unreadOnly
    ) {
        return notificationService.getNotifications(actorUserId, unreadOnly);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(
            @RequestHeader("X-Actor-User-Id") Long actorUserId
    ) {
        return notificationService.getUnreadCount(actorUserId);
    }

    @PatchMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(
            @RequestHeader("X-Actor-User-Id") Long actorUserId,
            @PathVariable Long notificationId
    ) {
        return notificationService.markAsRead(actorUserId, notificationId);
    }

    @PatchMapping("/read-all")
    public Map<String, Integer> markAllAsRead(
            @RequestHeader("X-Actor-User-Id") Long actorUserId
    ) {
        return notificationService.markAllAsRead(actorUserId);
    }
}
