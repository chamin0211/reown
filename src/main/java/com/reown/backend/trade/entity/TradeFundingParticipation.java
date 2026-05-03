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

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public TradeFundingParticipation(Long campaignId, Long userId, Integer amount) {
        this.campaignId = campaignId;
        this.userId = userId;
        this.amount = amount;
        this.status = "PARTICIPATED";
        this.createdAt = LocalDateTime.now();
    }
}
