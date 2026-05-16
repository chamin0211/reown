package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetResellTransactionRepository extends JpaRepository<AssetResellTransaction, Long> {

    List<AssetResellTransaction> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<AssetResellTransaction> findByResellIdOrderByCreatedAtDesc(Long resellId);
}
