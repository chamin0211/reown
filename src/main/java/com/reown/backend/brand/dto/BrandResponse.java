package com.reown.backend.brand.dto;

import com.reown.backend.brand.entity.Brand;

import java.math.BigDecimal;

public record BrandResponse(
        Long brandId,
        Long ownerUserId,
        String brandName,
        String brandLogoUrl,
        String businessNumber,
        String salesStatus,
        String settlementCycle,
        String status,
        BigDecimal commissionRate
) {
    public static BrandResponse from(Brand brand) {
        return new BrandResponse(
                brand.getBrandId(),
                brand.getOwnerUserId(),
                brand.getBrandName(),
                brand.getBrandLogoUrl(),
                brand.getBusinessNumber(),
                brand.getSalesStatus(),
                brand.getSettlementCycle(),
                brand.getStatus(),
                brand.getCommissionRate()
        );
    }
}
