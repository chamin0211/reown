/*
DB 관련 설명
- 펀딩 참여 후 응답 DTO입니다.
- trade_funding_participation에 저장된 participation_id, option_id, quantity, unit_price를 같이 내려줍니다.
- campaign에는 trade_funding_campaign의 current_amount, progress_rate가 반영되어 프론트에서 즉시 달성률을 갱신할 수 있습니다.
*/
package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradeFundingParticipation;

public record FundingParticipateResponse(
        Long userId,
        Integer participatedAmount,
        Long participationId,
        Long optionId,
        Integer quantity,
        Integer unitPrice,
        FundingCampaignResponse campaign
) {
    public static FundingParticipateResponse from(
            Long userId,
            Integer participatedAmount,
            TradeFundingParticipation participation,
            FundingCampaignResponse campaign
    ) {
        return new FundingParticipateResponse(
                userId,
                participatedAmount,
                participation.getParticipationId(),
                participation.getOptionId(),
                participation.getQuantityOrDefault(),
                participation.getUnitPrice(),
                campaign
        );
    }
}
