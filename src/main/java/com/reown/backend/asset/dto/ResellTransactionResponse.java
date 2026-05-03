package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellTransaction;

import java.time.LocalDateTime;

public record ResellTransactionResponse(
        Long transactionId,
        Long resellId,
        Long buyerId,
        Integer resellPrice,
        Integer platformFee,
        String status,
        LocalDateTime createdAt
) {
    public static ResellTransactionResponse from(AssetResellTransaction transaction) {
        return new ResellTransactionResponse(
                transaction.getTransactionId(),
                transaction.getResellId(),
                transaction.getBuyerId(),
                transaction.getResellPrice(),
                transaction.getPlatformFee(),
                transaction.getStatus(),
                transaction.getCreatedAt()
        );
    }
}