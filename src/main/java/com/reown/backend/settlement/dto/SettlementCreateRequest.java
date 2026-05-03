package com.reown.backend.settlement.dto;

import java.time.LocalDateTime;

public record SettlementCreateRequest(
        Long brandId,
        String settlementType,
        LocalDateTime periodStart,
        LocalDateTime periodEnd
) {
}
