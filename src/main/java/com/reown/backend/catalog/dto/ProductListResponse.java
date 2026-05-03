package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.Product;

public record ProductListResponse(
        Long productId,
        Long brandId,
        String name,
        String thumbnailUrl,
        Integer price,
        String saleType,
        String status
) {
    public static ProductListResponse from(Product product) {
        return new ProductListResponse(
                product.getProductId(),
                product.getBrandId(),
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getSaleType(),
                product.getStatus()
        );
    }
}