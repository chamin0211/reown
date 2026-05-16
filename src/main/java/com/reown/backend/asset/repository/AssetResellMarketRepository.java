package com.reown.backend.asset.repository;

import com.reown.backend.asset.entity.AssetResellMarket;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AssetResellMarketRepository extends JpaRepository<AssetResellMarket, Long> {

    List<AssetResellMarket> findByStatus(String status);

    List<AssetResellMarket> findByStatusOrderByCreatedAtDesc(String status);

    List<AssetResellMarket> findByStatusInOrderByCreatedAtDesc(Collection<String> statuses);

    List<AssetResellMarket> findBySellerId(Long sellerId);

    List<AssetResellMarket> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<AssetResellMarket> findBySellerIdAndStatusInOrderByCreatedAtDesc(Long sellerId, Collection<String> statuses);

    boolean existsByOrderItemId(Long orderItemId);

    boolean existsByOrderItemIdAndStatusIn(Long orderItemId, Collection<String> statuses);

    /**
     * 같은 리셀 상품에 동시에 여러 입찰이 들어왔을 때 최고가 갱신이 꼬이지 않도록
     * DB row 단위 비관적 락을 함께 사용합니다.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from AssetResellMarket r where r.resellId = :resellId")
    Optional<AssetResellMarket> findByIdForUpdate(@Param("resellId") Long resellId);

    List<AssetResellMarket> findByStatusAndAuctionEndAtBefore(String status, LocalDateTime now);

    /**
     * 자동 경매 마감 대상 ID만 먼저 조회합니다.
     * 실제 상태 변경은 findByIdForUpdate로 다시 잠금 조회한 뒤 처리합니다.
     */
    @Query("select r.resellId from AssetResellMarket r where r.status = 'ON_SALE' and r.auctionEndAt is not null and r.auctionEndAt <= :now")
    List<Long> findExpiredOnSaleIds(@Param("now") LocalDateTime now);
}
