package com.reown.backend.catalog.dto;

import jakarta.validation.constraints.PositiveOrZero;

public record ProductUpdateRequest(
        String name,
        String thumbnailUrl,

        @PositiveOrZero
        Integer price,

        String categoryName,
        String description,
        Integer weightG,
        Integer maxPurchasePerUser,
        String saleType,
        String status,
        Integer displaySortOrder
) {
}
