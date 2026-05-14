package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.Product;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailResponse(
        Long productId,
        Long brandId,
        String brandName,
        String name,
        String thumbnailUrl,
        Integer price,
        String categoryName,
        String description,
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
        return from(product, null, options);
    }

    public static ProductDetailResponse from(
            Product product,
            String brandName,
            List<ProductOptionResponse> options
    ) {
        return new ProductDetailResponse(
                product.getProductId(),
                product.getBrandId(),
                brandName,
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getCategoryName(),
                product.getDescription(),
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
