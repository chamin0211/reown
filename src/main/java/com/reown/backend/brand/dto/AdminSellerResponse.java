package com.reown.backend.brand.dto;

import com.reown.backend.auth.entity.User;
import com.reown.backend.brand.entity.Brand;

public record AdminSellerResponse(
        Long brandId,
        Long ownerUserId,
        String ownerEmail,
        String ownerNickname,
        String ownerRole,
        String brandName,
        String brandLogoUrl,
        String businessNumber,
        String salesStatus,
        String settlementCycle,
        String status
) {
    public static AdminSellerResponse from(Brand brand, User owner) {
        return new AdminSellerResponse(
                brand.getBrandId(),
                brand.getOwnerUserId(),
                owner.getEmail(),
                owner.getNickname(),
                owner.getRole().name(),
                brand.getBrandName(),
                brand.getBrandLogoUrl(),
                brand.getBusinessNumber(),
                brand.getSalesStatus(),
                brand.getSettlementCycle(),
                brand.getStatus()
        );
    }
}
