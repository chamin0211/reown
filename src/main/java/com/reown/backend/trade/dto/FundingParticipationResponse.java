package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradeFundingParticipation;

import java.time.LocalDateTime;

public record FundingParticipationResponse(
        Long participationId,
        Long campaignId,
        Long userId,
        Integer amount,
        String status,
        LocalDateTime createdAt
) {
    public static FundingParticipationResponse from(TradeFundingParticipation participation) {
        return new FundingParticipationResponse(
                participation.getParticipationId(),
                participation.getCampaignId(),
                participation.getUserId(),
                participation.getAmount(),
                participation.getStatus(),
                participation.getCreatedAt()
        );
    }
}
