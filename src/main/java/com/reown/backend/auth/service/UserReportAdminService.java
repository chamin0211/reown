package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.UserReportCreateRequest;
import com.reown.backend.auth.dto.UserReportResponse;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserReport;
import com.reown.backend.auth.repository.UserReportRepository;
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
public class UserReportAdminService {

    private final UserReportRepository userReportRepository;
    private final UserRepository userRepository;

    public List<UserReportResponse> getReports(String status) {
        List<UserReport> reports = status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)
                ? userReportRepository.findAll()
                : userReportRepository.findByStatus(status.trim().toUpperCase(Locale.ROOT));

        return reports.stream()
                .sorted(Comparator.comparing(UserReport::getReportId).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserReportResponse createReport(UserReportCreateRequest request) {
        if (request.reportedUserId() == null) {
            throw new IllegalArgumentException("신고 대상 사용자를 선택해주세요.");
        }
        if (request.reason() == null || request.reason().trim().isEmpty()) {
            throw new IllegalArgumentException("신고 사유를 입력해주세요.");
        }
        userRepository.findById(request.reportedUserId())
                .orElseThrow(() -> new IllegalArgumentException("신고 대상 사용자를 찾을 수 없습니다."));

        UserReport report = new UserReport(
                request.reportedUserId(),
                request.reporterUserId(),
                request.reason().trim(),
                request.detail() == null ? null : request.detail().trim()
        );
        return toResponse(userReportRepository.save(report));
    }

    @Transactional
    public UserReportResponse updateStatus(Long reportId, String status) {
        UserReport report = userReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고 내역을 찾을 수 없습니다. reportId=" + reportId));
        String normalizedStatus = status == null ? "DONE" : status.trim().toUpperCase(Locale.ROOT);
        report.changeStatus(normalizedStatus);
        return toResponse(report);
    }

    private UserReportResponse toResponse(UserReport report) {
        User reportedUser = userRepository.findById(report.getReportedUserId()).orElse(null);
        User reporterUser = report.getReporterUserId() == null
                ? null
                : userRepository.findById(report.getReporterUserId()).orElse(null);
        return UserReportResponse.from(report, reportedUser, reporterUser);
    }
}
