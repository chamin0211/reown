package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ResellCreateRequest(
        @NotNull
        Long sellerId,

        @NotNull
        Long orderItemId,

        @NotNull
        @Positive
        Integer resellPrice,

        String conditionDescription
) {
}
