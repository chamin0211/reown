package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.trade.entity.TradeWishItem;

import java.time.LocalDateTime;

public record WishItemResponse(
        Long wishId,
        Long userId,
        Long productId,
        Long brandId,
        String productName,
        String thumbnailUrl,
        Integer price,
        String saleType,
        String status,
        LocalDateTime createdAt
) {
    public static WishItemResponse from(TradeWishItem wishItem, Product product) {
        return new WishItemResponse(
                wishItem.getWishId(),
                wishItem.getUserId(),
                product.getProductId(),
                product.getBrandId(),
                product.getName(),
                product.getThumbnailUrl(),
                product.getPrice(),
                product.getSaleType(),
                product.getStatus(),
                wishItem.getCreatedAt()
        );
    }
}
