package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellTransaction;

import java.time.LocalDateTime;

public record ResellTransactionResponse(
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
        LocalDateTime canceledAt
) {
    public static ResellTransactionResponse from(AssetResellTransaction transaction) {
        return new ResellTransactionResponse(
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
                transaction.getCanceledAt()
        );
    }
}
