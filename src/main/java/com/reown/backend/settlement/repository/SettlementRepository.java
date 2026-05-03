package com.reown.backend.settlement.repository;

import com.reown.backend.settlement.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findByBrandIdOrderByCreatedAtDesc(Long brandId);

    List<Settlement> findByStatusOrderByCreatedAtDesc(String status);
}
