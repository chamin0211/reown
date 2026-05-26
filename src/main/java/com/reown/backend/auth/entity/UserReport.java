package com.reown.backend.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_user_report")
@Getter
@NoArgsConstructor
public class UserReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "reported_user_id", nullable = false)
    private Long reportedUserId;

    @Column(name = "reporter_user_id")
    private Long reporterUserId;

    @Column(name = "reason", nullable = false, length = 100)
    private String reason;

    @Column(name = "detail", length = 1000)
    private String detail;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    public UserReport(Long reportedUserId, Long reporterUserId, String reason, String detail) {
        this.reportedUserId = reportedUserId;
        this.reporterUserId = reporterUserId;
        this.reason = reason;
        this.detail = detail;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public void changeStatus(String status) {
        this.status = status;
        this.processedAt = LocalDateTime.now();
    }
}
