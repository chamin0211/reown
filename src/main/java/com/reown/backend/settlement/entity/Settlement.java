package com.reown.backend.settlement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "settlement")
@Getter
@NoArgsConstructor
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settlement_id")
    private Long settlementId;

    @Column(name = "brand_id", nullable = false)
    private Long brandId;

    @Column(name = "settlement_type", nullable = false)
    private String settlementType;

    @Column(name = "total_sales_amount", nullable = false)
    private Integer totalSalesAmount;

    @Column(name = "platform_fee", nullable = false)
    private Integer platformFee;

    @Column(name = "settlement_amount", nullable = false)
    private Integer settlementAmount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "period_start")
    private LocalDateTime periodStart;

    @Column(name = "period_end")
    private LocalDateTime periodEnd;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    public Settlement(
            Long brandId,
            String settlementType,
            Integer totalSalesAmount,
            Integer platformFee,
            Integer settlementAmount,
            LocalDateTime periodStart,
            LocalDateTime periodEnd
    ) {
        this.brandId = brandId;
        this.settlementType = settlementType;
        this.totalSalesAmount = totalSalesAmount;
        this.platformFee = platformFee;
        this.settlementAmount = settlementAmount;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.status = "READY";
        this.createdAt = LocalDateTime.now();
    }

    public void complete() {
        this.status = "COMPLETED";
        this.settledAt = LocalDateTime.now();
    }
}
