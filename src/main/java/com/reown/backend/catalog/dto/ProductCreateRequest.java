package com.reown.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public record ProductCreateRequest(
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
        Integer weightG,
        Integer maxPurchasePerUser,
        String saleType,
        String status,
        Integer displaySortOrder,
        List<ProductOptionCreateRequest> options
) {
}
