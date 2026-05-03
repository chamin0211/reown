package com.reown.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductCreateRequest(
        @NotNull
        Long brandId,

        @NotBlank
        String name,

        String thumbnailUrl,

        @NotNull
        @PositiveOrZero
        Integer price,

        Integer weightG,
        Integer maxPurchasePerUser,
        String saleType,
        String status,
        Integer displaySortOrder
) {
}