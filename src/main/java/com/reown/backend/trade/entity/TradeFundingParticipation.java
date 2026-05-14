/*
DB 관련 설명
- 매핑 테이블: trade_funding_participation
- 기존 컬럼: participation_id, campaign_id, user_id, amount, status, created_at
- 추가 컬럼: option_id, quantity, unit_price
  1) option_id: 사용자가 선택한 catalog_product_option.option_id입니다. 옵션이 없는 더미 펀딩은 null 가능합니다.
  2) quantity: 사용자가 선택한 수량입니다. 기존 더미 데이터는 null일 수 있어서 getter에서 기본값 1로 처리합니다.
  3) unit_price: 참여 당시 상품 1개 가격입니다. 나중에 상품 가격이 바뀌어도 당시 참여 금액을 설명할 수 있습니다.
- ddl-auto=update가 켜져 있으면 컬럼은 자동 생성됩니다.
  자동 생성이 안 되면 아래 SQL을 실행하세요.

  ALTER TABLE trade_funding_participation ADD COLUMN option_id BIGINT NULL;
  ALTER TABLE trade_funding_participation ADD COLUMN quantity INT NULL;
  ALTER TABLE trade_funding_participation ADD COLUMN unit_price INT NULL;
*/
package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_funding_participation")
@Getter
@NoArgsConstructor
public class TradeFundingParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participation_id")
    private Long participationId;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "option_id")
    private Long optionId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Integer unitPrice;

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public TradeFundingParticipation(Long campaignId, Long userId, Integer amount) {
        this(campaignId, userId, null, 1, amount, amount);
    }

    public TradeFundingParticipation(
            Long campaignId,
            Long userId,
            Long optionId,
            Integer quantity,
            Integer unitPrice,
            Integer amount
    ) {
        this.campaignId = campaignId;
        this.userId = userId;
        this.optionId = optionId;
        this.quantity = quantity != null && quantity > 0 ? quantity : 1;
        this.unitPrice = unitPrice;
        this.amount = amount;
        this.status = "PARTICIPATED";
        this.createdAt = LocalDateTime.now();
    }

    public Integer getQuantityOrDefault() {
        return quantity != null && quantity > 0 ? quantity : 1;
    }

    public void cancel() {
        if ("CANCELED".equals(this.status)) {
            throw new IllegalArgumentException("이미 취소된 펀딩 참여 내역입니다.");
        }

        this.status = "CANCELED";
    }
}
