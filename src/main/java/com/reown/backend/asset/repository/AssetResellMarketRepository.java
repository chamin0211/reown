package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellMarket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetResellMarketRepository extends JpaRepository<AssetResellMarket, Long> {

    List<AssetResellMarket> findByStatus(String status);

    List<AssetResellMarket> findBySellerId(Long sellerId);

    List<AssetResellMarket> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    boolean existsByOrderItemId(Long orderItemId);
}