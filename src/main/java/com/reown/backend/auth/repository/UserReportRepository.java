package com.reown.backend.auth.repository;

import com.reown.backend.auth.entity.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    List<UserReport> findByStatus(String status);
}
