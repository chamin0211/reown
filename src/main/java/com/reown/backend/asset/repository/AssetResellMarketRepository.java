package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellMarket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AssetResellMarketRepository extends JpaRepository<AssetResellMarket, Long> {

    List<AssetResellMarket> findByStatus(String status);

    List<AssetResellMarket> findByStatusOrderByCreatedAtDesc(String status);

    List<AssetResellMarket> findByStatusInOrderByCreatedAtDesc(Collection<String> statuses);

    List<AssetResellMarket> findBySellerId(Long sellerId);

    List<AssetResellMarket> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<AssetResellMarket> findBySellerIdAndStatusInOrderByCreatedAtDesc(Long sellerId, Collection<String> statuses);

    boolean existsByOrderItemId(Long orderItemId);

    boolean existsByOrderItemIdAndStatusIn(Long orderItemId, Collection<String> statuses);
}
