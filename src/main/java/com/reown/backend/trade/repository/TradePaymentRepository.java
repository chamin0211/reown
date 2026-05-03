package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradePayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TradePaymentRepository extends JpaRepository<TradePayment, Long> {

    Optional<TradePayment> findByOrderId(Long orderId);
}