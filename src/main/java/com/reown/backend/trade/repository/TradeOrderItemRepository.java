package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeOrderItemRepository extends JpaRepository<TradeOrderItem, Long> {

    List<TradeOrderItem> findByOrderId(Long orderId);
}