package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeFundingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeFundingCampaignRepository extends JpaRepository<TradeFundingCampaign, Long> {

    List<TradeFundingCampaign> findAllByOrderByStartDateDesc();

    List<TradeFundingCampaign> findByFundingStatusOrderByStartDateDesc(String fundingStatus);
}