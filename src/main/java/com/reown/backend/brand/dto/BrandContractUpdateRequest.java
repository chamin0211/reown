package com.reown.backend.brand.dto;

import java.math.BigDecimal;

public record BrandContractUpdateRequest(
        String settlementCycle,
        BigDecimal commissionRate,
        String salesStatus
) {
}
