package com.reown.backend.auth.controller;

import com.reown.backend.auth.dto.AdminUserResponse;
import com.reown.backend.auth.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<AdminUserResponse> getUsers(@RequestParam(required = false) String role) {
        return adminUserService.getUsers(role);
    }

    @GetMapping("/admin-applications")
    public List<AdminUserResponse> getAdminApplications() {
        return adminUserService.getAdminApplications();
    }

    @PatchMapping("/{userId}/approve-admin")
    public AdminUserResponse approveAdmin(@PathVariable Long userId) {
        return adminUserService.approveAdmin(userId);
    }

    @PatchMapping("/{userId}/reject-admin")
    public AdminUserResponse rejectAdmin(@PathVariable Long userId) {
        return adminUserService.rejectAdmin(userId);
    }

    @PatchMapping("/{userId}/grant-master")
    public AdminUserResponse grantMaster(@PathVariable Long userId) {
        return adminUserService.grantMaster(userId);
    }

    @PatchMapping("/{userId}/revoke-master")
    public AdminUserResponse revokeMaster(@PathVariable Long userId) {
        return adminUserService.revokeMaster(userId);
    }
}
