package com.reown.backend.brand.dto;

import com.reown.backend.auth.entity.User;
import com.reown.backend.brand.entity.Brand;

import java.math.BigDecimal;

public record BrandContractResponse(
        Long brandId,
        String brandName,
        Long ownerUserId,
        String ownerLoginId,
        String ownerNickname,
        String ownerRole,
        String businessNumber,
        String status,
        String salesStatus,
        String settlementCycle,
        BigDecimal commissionRate
) {
    public static BrandContractResponse from(Brand brand, User owner) {
        return new BrandContractResponse(
                brand.getBrandId(),
                brand.getBrandName(),
                brand.getOwnerUserId(),
                owner.getLoginId(),
                owner.getNickname(),
                owner.getRole().name(),
                brand.getBusinessNumber(),
                brand.getStatus(),
                brand.getSalesStatus(),
                brand.getSettlementCycle(),
                brand.getCommissionRate()
        );
    }
}
