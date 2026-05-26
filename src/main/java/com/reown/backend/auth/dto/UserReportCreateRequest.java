package com.reown.backend.auth.dto;

public record UserReportCreateRequest(
        Long reportedUserId,
        Long reporterUserId,
        String reason,
        String detail
) {
}
