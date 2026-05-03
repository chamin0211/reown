package com.reown.backend.catalog.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductOptionCreateRequest(
        String size,
        String color,
        String colorHex,

        @NotNull
        @PositiveOrZero
        Integer stockQuantity,

        Integer safetyStock,
        Integer reservedQuantity
) {
}