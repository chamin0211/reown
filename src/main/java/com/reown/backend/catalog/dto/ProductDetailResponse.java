package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.Product;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailResponse(
        Long productId,
        Long brandId,
        String name,
        String thumbnailUrl,
        Integer price,
        Integer weightG,
        Integer maxPurchasePerUser,
        String saleType,
        String status,
        Integer displaySortOrder,
        LocalDateTime createdAt,
        List<ProductOptionResponse> options
) {
    public static ProductDetailResponse from(
            Product product,
            List<ProductOptionResponse> options
    ) {
        return new ProductDetailResponse(
                product.getProductId(),
                product.getBrandId(),
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getWeightG(),
                product.getMaxPurchasePerUser(),
                product.getSaleType(),
                product.getStatus(),
                product.getDisplaySortOrder(),
                product.getCreatedAt(),
                options
        );
    }
}