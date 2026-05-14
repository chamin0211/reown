/*
DB 관련 설명
- 내 펀딩 참여 내역 조회용 DTO입니다.
- trade_funding_participation 테이블의 참여 내역을 그대로 화면에 보여줍니다.
- option_id, quantity, unit_price는 새로 추가되는 컬럼입니다.
  application-local.yml의 spring.jpa.hibernate.ddl-auto=update이면 자동 추가됩니다.
  자동 추가가 안 되면 아래 SQL을 한 번 실행하면 됩니다.

  ALTER TABLE trade_funding_participation ADD COLUMN option_id BIGINT NULL;
  ALTER TABLE trade_funding_participation ADD COLUMN quantity INT NULL;
  ALTER TABLE trade_funding_participation ADD COLUMN unit_price INT NULL;
*/
package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradeFundingParticipation;

import java.time.LocalDateTime;

public record FundingParticipationResponse(
        Long participationId,
        Long campaignId,
        Long userId,
        Long optionId,
        Integer quantity,
        Integer unitPrice,
        Integer amount,
        String status,
        LocalDateTime createdAt
) {
    public static FundingParticipationResponse from(TradeFundingParticipation participation) {
        return new FundingParticipationResponse(
                participation.getParticipationId(),
                participation.getCampaignId(),
                participation.getUserId(),
                participation.getOptionId(),
                participation.getQuantityOrDefault(),
                participation.getUnitPrice(),
                participation.getAmount(),
                participation.getStatus(),
                participation.getCreatedAt()
        );
    }
}
