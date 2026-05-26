package com.reown.backend.auth.dto;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserReport;

import java.time.LocalDateTime;

public record UserReportResponse(
        Long reportId,
        Long reportedUserId,
        String reportedLoginId,
        String reportedNickname,
        String reportedRole,
        Long reporterUserId,
        String reporterLoginId,
        String reason,
        String detail,
        String status,
        LocalDateTime createdAt,
        LocalDateTime processedAt
) {
    public static UserReportResponse from(UserReport report, User reportedUser, User reporterUser) {
        return new UserReportResponse(
                report.getReportId(),
                report.getReportedUserId(),
                reportedUser != null ? reportedUser.getLoginId() : null,
                reportedUser != null ? reportedUser.getNickname() : null,
                reportedUser != null ? reportedUser.getRole().name() : null,
                report.getReporterUserId(),
                reporterUser != null ? reporterUser.getLoginId() : null,
                report.getReason(),
                report.getDetail(),
                report.getStatus(),
                report.getCreatedAt(),
                report.getProcessedAt()
        );
    }
}
