package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellPriceOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetResellPriceOfferRepository extends JpaRepository<AssetResellPriceOffer, Long> {

    List<AssetResellPriceOffer> findByResellId(Long resellId);

    List<AssetResellPriceOffer> findByResellIdOrderByCreatedAtDesc(Long resellId);

    List<AssetResellPriceOffer> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}