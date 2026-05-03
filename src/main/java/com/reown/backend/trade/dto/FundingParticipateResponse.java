package com.reown.backend.trade.dto;

public record FundingParticipateResponse(
        Long userId,
        Integer participatedAmount,
        FundingCampaignResponse campaign
) {
    public static FundingParticipateResponse from(
            Long userId,
            Integer participatedAmount,
            FundingCampaignResponse campaign
    ) {
        return new FundingParticipateResponse(
                userId,
                participatedAmount,
                campaign
        );
    }
}