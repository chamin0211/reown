package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.trade.entity.TradeFundingCampaign;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public record FundingCampaignResponse(
        Long campaignId,
        Long productId,
        Long brandId,
        String brandName,
        String productName,
        String thumbnailUrl,
        Integer productPrice,
        String categoryName,
        String productStatus,
        Integer maxPurchasePerUser,
        Integer targetAmount,
        Integer currentAmount,
        Integer remainingAmount,
        Double progressRate,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String fundingStatus,
        String productionStage,
        String productionStageLabel,
        Boolean canUpdateProductionStage,
        Long participantCount,
        Long remainingDays
) {
    public static FundingCampaignResponse from(
            TradeFundingCampaign campaign,
            Product product
    ) {
        return from(campaign, product, null, 0L);
    }

    public static FundingCampaignResponse from(
            TradeFundingCampaign campaign,
            Product product,
            String brandName
    ) {
        return from(campaign, product, brandName, 0L);
    }

    public static FundingCampaignResponse from(
            TradeFundingCampaign campaign,
            Product product,
            String brandName,
            Long participantCount
    ) {
        Integer currentAmount = campaign.getCurrentAmount() != null ? campaign.getCurrentAmount() : 0;
        Integer targetAmount = campaign.getTargetAmount() != null ? campaign.getTargetAmount() : 0;
        Integer remainingAmount = Math.max(targetAmount - currentAmount, 0);
        Double progressRate = calculateProgressRate(currentAmount, targetAmount);
        String productionStage = campaign.getProductionStageValue();

        return new FundingCampaignResponse(
                campaign.getCampaignId(),
                campaign.getProductId(),
                product.getBrandId(),
                brandName,
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getCategoryName(),
                product.getStatus(),
                product.getMaxPurchasePerUser(),
                targetAmount,
                currentAmount,
                remainingAmount,
                progressRate,
                campaign.getStartDate(),
                campaign.getEndDate(),
                campaign.getFundingStatus(),
                productionStage,
                productionStageLabel(productionStage),
                TradeFundingCampaign.STATUS_SUCCESS.equals(campaign.getFundingStatus()),
                participantCount != null ? participantCount : 0L,
                calculateRemainingDays(campaign.getEndDate())
        );
    }

    private static Double calculateProgressRate(Integer currentAmount, Integer targetAmount) {
        if (targetAmount == null || targetAmount <= 0) {
            return 0.0;
        }

        double rate = (currentAmount * 100.0) / targetAmount;
        return Math.round(rate * 10.0) / 10.0;
    }

    private static Long calculateRemainingDays(LocalDateTime endDate) {
        if (endDate == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(endDate)) {
            return 0L;
        }

        return Math.max(0L, ChronoUnit.DAYS.between(now.toLocalDate(), endDate.toLocalDate()));
    }

    private static String productionStageLabel(String stage) {
        if (stage == null) {
            return "제작 전";
        }

        return switch (stage) {
            case TradeFundingCampaign.STAGE_PRODUCTION_READY -> "제작 준비";
            case TradeFundingCampaign.STAGE_IN_PRODUCTION -> "제작 중";
            case TradeFundingCampaign.STAGE_SHIPPING_PREP -> "배송 준비";
            case TradeFundingCampaign.STAGE_SHIPPED -> "배송 완료";
            default -> "제작 전";
        };
    }
}
