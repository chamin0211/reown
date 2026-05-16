package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeFundingParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TradeFundingParticipationRepository extends JpaRepository<TradeFundingParticipation, Long> {

    List<TradeFundingParticipation> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);

    List<TradeFundingParticipation> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("""
            select coalesce(sum(coalesce(p.quantity, 1)), 0)
            from TradeFundingParticipation p
            where p.campaignId = :campaignId
              and p.userId = :userId
              and p.status <> 'CANCELED'
            """)
    Long sumActiveQuantityByCampaignIdAndUserId(
            @Param("campaignId") Long campaignId,
            @Param("userId") Long userId
    );

    @Query("""
            select count(distinct p.userId)
            from TradeFundingParticipation p
            where p.campaignId = :campaignId
              and p.status <> 'CANCELED'
            """)
    Long countActiveByCampaignId(@Param("campaignId") Long campaignId);
}
