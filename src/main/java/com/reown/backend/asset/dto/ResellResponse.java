package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;

import java.time.LocalDateTime;

public record ResellResponse(
        Long resellId,
        Long orderItemId,
        Long sellerId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        Integer resellPrice,
        String conditionDescription,
        String status,
        LocalDateTime createdAt
) {
    public static ResellResponse from(
            AssetResellMarket resell,
            Product product,
            ProductOption option
    ) {
        return new ResellResponse(
                resell.getResellId(),
                resell.getOrderItemId(),
                resell.getSellerId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                resell.getResellPrice(),
                resell.getConditionDescription(),
                resell.getStatus(),
                resell.getCreatedAt()
        );
    }
}
