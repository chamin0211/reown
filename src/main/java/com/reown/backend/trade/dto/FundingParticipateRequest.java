/*
DB 관련 설명
- 이 요청은 trade_funding_participation 테이블에 참여 내역을 저장할 때 사용됩니다.
- user_id: 참여 사용자 ID입니다.
- option_id: 선택한 상품 옵션 ID입니다. 옵션 없는 펀딩은 null로 저장됩니다.
- quantity: 참여 수량입니다. null이면 1개로 처리합니다.
- amount: 참여 금액입니다. 새 프론트에서는 상품 가격 × 수량으로 자동 계산해서 보냅니다.
  백엔드도 product.price × quantity 기준으로 다시 계산하므로, 더미 데이터에서 실제 DB 등록 방식으로 바꿔도 같은 구조를 유지할 수 있습니다.
*/
package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FundingParticipateRequest(
        @NotNull
        Long userId,

        Long optionId,

        @Positive
        Integer quantity,

        @Positive
        Integer amount
) {
}
