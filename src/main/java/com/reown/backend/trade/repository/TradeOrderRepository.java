package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeOrderRepository extends JpaRepository<TradeOrder, Long> {

    List<TradeOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<TradeOrder> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
}