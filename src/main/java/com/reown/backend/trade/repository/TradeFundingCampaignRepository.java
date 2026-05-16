package com.reown.backend.trade.repository;

import com.reown.backend.trade.entity.TradeFundingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TradeFundingCampaignRepository extends JpaRepository<TradeFundingCampaign, Long> {

    List<TradeFundingCampaign> findAllByOrderByStartDateDesc();

    List<TradeFundingCampaign> findByFundingStatusOrderByStartDateDesc(String fundingStatus);

    List<TradeFundingCampaign> findByFundingStatusInOrderByStartDateDesc(Collection<String> fundingStatuses);

    Optional<TradeFundingCampaign> findByProductId(Long productId);
}
