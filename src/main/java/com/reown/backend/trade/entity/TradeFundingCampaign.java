/*
DB 관련 설명
- 매핑 테이블: trade_funding_campaign
- current_amount는 trade_funding_participation.amount 합계와 같은 의미로 관리됩니다.
- 참여 시 current_amount가 증가하고, 참여 취소 시 current_amount가 차감됩니다.
- target_amount 이상이 되면 funding_status를 SUCCESS로 변경합니다.
- 발표/테스트 중 취소로 current_amount가 target_amount보다 작아지면 다시 OPEN으로 돌려서 재참여가 가능하게 했습니다.
*/
package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_funding_campaign")
@Getter
@NoArgsConstructor
public class TradeFundingCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "target_amount", nullable = false)
    private Integer targetAmount;

    @Column(name = "current_amount", nullable = false)
    private Integer currentAmount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "funding_status")
    private String fundingStatus;

    public TradeFundingCampaign(
            Long productId,
            Integer targetAmount,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String fundingStatus
    ) {
        this.productId = productId;
        this.targetAmount = targetAmount;
        this.currentAmount = 0;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fundingStatus = fundingStatus != null ? fundingStatus : "OPEN";
    }

    public void participate(Integer amount, LocalDateTime now) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("펀딩 참여 금액은 1원 이상이어야 합니다.");
        }

        if (!"OPEN".equals(this.fundingStatus)) {
            throw new IllegalArgumentException("참여 가능한 펀딩이 아닙니다. status=" + this.fundingStatus);
        }

        validatePeriod(now);

        this.currentAmount += amount;

        if (this.currentAmount >= this.targetAmount) {
            this.fundingStatus = "SUCCESS";
        }
    }

    public void cancelParticipation(Integer amount, LocalDateTime now) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("취소 금액은 1원 이상이어야 합니다.");
        }

        if ("CANCELED".equals(this.fundingStatus) || "FAILED".equals(this.fundingStatus)) {
            throw new IllegalArgumentException("취소 처리할 수 없는 펀딩 상태입니다. status=" + this.fundingStatus);
        }

        this.currentAmount = Math.max(0, this.currentAmount - amount);

        if (this.currentAmount < this.targetAmount && "SUCCESS".equals(this.fundingStatus)) {
            if (this.endDate != null && now.isAfter(this.endDate)) {
                this.fundingStatus = "FAILED";
            } else {
                this.fundingStatus = "OPEN";
            }
        }
    }

    public void cancel() {
        if ("SUCCESS".equals(this.fundingStatus)) {
            throw new IllegalArgumentException("이미 성공한 펀딩은 취소할 수 없습니다.");
        }

        this.fundingStatus = "CANCELED";
    }

    private void validatePeriod(LocalDateTime now) {
        if (this.startDate != null && now.isBefore(this.startDate)) {
            throw new IllegalArgumentException("아직 시작 전인 펀딩입니다.");
        }

        if (this.endDate != null && now.isAfter(this.endDate)) {
            if (this.currentAmount >= this.targetAmount) {
                this.fundingStatus = "SUCCESS";
            } else {
                this.fundingStatus = "FAILED";
            }
            throw new IllegalArgumentException("이미 종료된 펀딩입니다.");
        }
    }
}
