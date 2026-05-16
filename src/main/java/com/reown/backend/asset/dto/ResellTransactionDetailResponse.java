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
        Integer resellPrice,
        Integer platformFee,
        Integer settlementAmount,
        String status,
        String courierName,
        String trackingNumber,
        String cancelReason,
        LocalDateTime createdAt,
        LocalDateTime paidAt,
        LocalDateTime shipmentPreparedAt,
        LocalDateTime shippedAt,
        LocalDateTime purchaseConfirmedAt,
        LocalDateTime settledAt,
        LocalDateTime canceledAt,
        Long sellerId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        String rarityGrade
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
                transaction.getResellPrice(),
                transaction.getPlatformFee(),
                transaction.getSettlementAmount(),
                transaction.getStatus(),
                transaction.getCourierName(),
                transaction.getTrackingNumber(),
                transaction.getCancelReason(),
                transaction.getCreatedAt(),
                transaction.getPaidAt(),
                transaction.getShipmentPreparedAt(),
                transaction.getShippedAt(),
                transaction.getPurchaseConfirmedAt(),
                transaction.getSettledAt(),
                transaction.getCanceledAt(),
                resell.getSellerId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                resell.getRarityGrade()
        );
    }
}
