package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeFundingUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeFundingUpdateRepository extends JpaRepository<TradeFundingUpdate, Long> {

    List<TradeFundingUpdate> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);
}
