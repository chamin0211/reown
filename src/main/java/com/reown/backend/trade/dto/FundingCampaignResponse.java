package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.trade.entity.TradeFundingCampaign;

import java.time.LocalDateTime;

public record FundingCampaignResponse(
        Long campaignId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Integer productPrice,
        Integer targetAmount,
        Integer currentAmount,
        Integer remainingAmount,
        Double progressRate,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String fundingStatus
) {
    public static FundingCampaignResponse from(
            TradeFundingCampaign campaign,
            Product product
    ) {
        Integer remainingAmount = Math.max(campaign.getTargetAmount() - campaign.getCurrentAmount(), 0);
        Double progressRate = calculateProgressRate(campaign.getCurrentAmount(), campaign.getTargetAmount());

        return new FundingCampaignResponse(
                campaign.getCampaignId(),
                campaign.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                campaign.getTargetAmount(),
                campaign.getCurrentAmount(),
                remainingAmount,
                progressRate,
                campaign.getStartDate(),
                campaign.getEndDate(),
                campaign.getFundingStatus()
        );
    }

    private static Double calculateProgressRate(Integer currentAmount, Integer targetAmount) {
        if (targetAmount == null || targetAmount <= 0) {
            return 0.0;
        }

        double rate = (currentAmount * 100.0) / targetAmount;
        return Math.round(rate * 10.0) / 10.0;
    }
}
