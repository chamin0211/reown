package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeWishItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradeWishItemRepository extends JpaRepository<TradeWishItem, Long> {

    List<TradeWishItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<TradeWishItem> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}