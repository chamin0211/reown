package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.ProductOption;

public record ProductOptionResponse(
        Long optionId,
        String size,
        String color,
        String colorHex,
        Integer stockQuantity,
        Integer safetyStock,
        Integer reservedQuantity
) {
    public static ProductOptionResponse from(ProductOption option) {
        return new ProductOptionResponse(
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                option.getColorHex(),
                option.getStockQuantity(),
                option.getSafetyStock(),
                option.getReservedQuantity()
        );
    }
}