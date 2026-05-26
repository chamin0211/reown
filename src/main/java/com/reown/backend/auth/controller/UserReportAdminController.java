package com.reown.backend.auth.controller;

import com.reown.backend.auth.dto.UserReportCreateRequest;
import com.reown.backend.auth.dto.UserReportResponse;
import com.reown.backend.auth.dto.UserReportStatusUpdateRequest;
import com.reown.backend.auth.service.UserReportAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/user-reports")
public class UserReportAdminController {

    private final UserReportAdminService userReportAdminService;

    @GetMapping
    public List<UserReportResponse> getReports(@RequestParam(required = false) String status) {
        return userReportAdminService.getReports(status);
    }

    @PostMapping
    public UserReportResponse createReport(@RequestBody UserReportCreateRequest request) {
        return userReportAdminService.createReport(request);
    }

    @PatchMapping("/{reportId}/status")
    public UserReportResponse updateStatus(@PathVariable Long reportId, @RequestBody UserReportStatusUpdateRequest request) {
        return userReportAdminService.updateStatus(reportId, request.status());
    }
}
