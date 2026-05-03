package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartItemAddRequest(
        @NotNull
        Long userId,

        @NotNull
        Long optionId,

        @NotNull
        @Positive
        Integer quantity
) {
}