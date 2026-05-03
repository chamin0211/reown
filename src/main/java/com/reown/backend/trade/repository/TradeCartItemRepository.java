package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradeCartItemRepository extends JpaRepository<TradeCartItem, Long> {

    List<TradeCartItem> findByUserId(Long userId);

    Optional<TradeCartItem> findByUserIdAndOptionId(Long userId, Long optionId);

    void deleteByUserId(Long userId);
}