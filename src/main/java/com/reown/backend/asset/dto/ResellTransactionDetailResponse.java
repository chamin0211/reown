package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellTransaction;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;

import java.time.LocalDateTime;

public record ResellTransactionDetailResponse(
        Long transactionId,
        Long resellId,
        Long buyerId,
        Long sellerId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        Integer resellPrice,
        Integer platformFee,
        String status,
        LocalDateTime createdAt
) {
    public static ResellTransactionDetailResponse from(
            AssetResellTransaction transaction,
            AssetResellMarket resell,
            Product product,
            ProductOption option
    ) {
        return new ResellTransactionDetailResponse(
                transaction.getTransactionId(),
                transaction.getResellId(),
                transaction.getBuyerId(),
                resell.getSellerId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                transaction.getResellPrice(),
                transaction.getPlatformFee(),
                transaction.getStatus(),
                transaction.getCreatedAt()
        );
    }
}
