package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.Product;

import java.time.LocalDateTime;

public record ProductListResponse(
        Long productId,
        Long brandId,
        String brandName,
        String name,
        String thumbnailUrl,
        Integer price,
        String categoryName,
        String description,
        String saleType,
        String status,
        LocalDateTime createdAt
) {
    public static ProductListResponse from(Product product) {
        return from(product, null);
    }

    public static ProductListResponse from(Product product, String brandName) {
        return new ProductListResponse(
                product.getProductId(),
                product.getBrandId(),
                brandName,
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getCategoryName(),
                product.getDescription(),
                product.getSaleType(),
                product.getStatus(),
                product.getCreatedAt()
        );
    }
}
