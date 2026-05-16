package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellTransaction;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssetResellTransactionRepository extends JpaRepository<AssetResellTransaction, Long> {

    List<AssetResellTransaction> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<AssetResellTransaction> findByResellIdOrderByCreatedAtDesc(Long resellId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from AssetResellTransaction t where t.transactionId = :transactionId")
    Optional<AssetResellTransaction> findByIdForUpdate(@Param("transactionId") Long transactionId);
}
