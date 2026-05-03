package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeFundingParticipation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeFundingParticipationRepository extends JpaRepository<TradeFundingParticipation, Long> {

    List<TradeFundingParticipation> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);

    List<TradeFundingParticipation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
