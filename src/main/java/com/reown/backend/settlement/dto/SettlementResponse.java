package com.reown.backend.settlement.dto;

import com.reown.backend.settlement.entity.Settlement;

import java.time.LocalDateTime;

public record SettlementResponse(
        Long settlementId,
        Long brandId,
        String settlementType,
        Integer totalSalesAmount,
        Integer platformFee,
        Integer settlementAmount,
        String status,
        LocalDateTime periodStart,
        LocalDateTime periodEnd,
        LocalDateTime createdAt,
        LocalDateTime settledAt
) {
    public static SettlementResponse from(Settlement settlement) {
        return new SettlementResponse(
                settlement.getSettlementId(),
                settlement.getBrandId(),
                settlement.getSettlementType(),
                settlement.getTotalSalesAmount(),
                settlement.getPlatformFee(),
                settlement.getSettlementAmount(),
                settlement.getStatus(),
                settlement.getPeriodStart(),
                settlement.getPeriodEnd(),
                settlement.getCreatedAt(),
                settlement.getSettledAt()
        );
    }
}
