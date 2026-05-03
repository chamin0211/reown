package com.reown.backend.brand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BrandApplyRequest(
        @NotNull Long ownerUserId,
        @NotBlank String brandName,
        String brandLogoUrl,
        String businessNumber,
        String settlementCycle
) {
}
