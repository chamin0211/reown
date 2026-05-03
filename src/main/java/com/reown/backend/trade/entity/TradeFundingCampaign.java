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

        this.currentAmount += amount;

        if (this.currentAmount >= this.targetAmount) {
            this.fundingStatus = "SUCCESS";
        }
    }

    public void cancel() {
        if ("SUCCESS".equals(this.fundingStatus)) {
            throw new IllegalArgumentException("이미 성공한 펀딩은 취소할 수 없습니다.");
        }

        this.fundingStatus = "CANCELED";
    }
}