package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record FundingProductCreateRequest(
        @NotNull
        Long brandId,

        @NotBlank
        String name,

        String thumbnailUrl,

        @NotNull
        @PositiveOrZero
        Integer price,

        String categoryName,
        String description,

        @NotNull
        @Positive
        Integer targetAmount,

        LocalDateTime startDate,
        LocalDateTime endDate,

        String size,
        String color,
        String colorHex,
        Integer stockQuantity,
        Integer safetyStock,
        Integer maxPurchasePerUser
) {
}
