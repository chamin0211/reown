package com.reown.backend.brand.service;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.brand.dto.BrandContractResponse;
import com.reown.backend.brand.dto.BrandContractUpdateRequest;
import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandContractAdminService {

    private final BrandRepository brandRepository;
    private final UserRepository userRepository;

    public List<BrandContractResponse> getContracts() {
        return brandRepository.findByStatus("APPROVED")
                .stream()
                .sorted(Comparator.comparing(Brand::getBrandId).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BrandContractResponse updateContract(Long brandId, BrandContractUpdateRequest request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId));

        BigDecimal commissionRate = request.commissionRate();
        if (commissionRate != null && (commissionRate.compareTo(BigDecimal.ZERO) < 0 || commissionRate.compareTo(BigDecimal.valueOf(100)) > 0)) {
            throw new IllegalArgumentException("수수료율은 0~100 사이여야 합니다.");
        }

        brand.updateContract(request.settlementCycle(), commissionRate, request.salesStatus());
        return toResponse(brand);
    }

    private BrandContractResponse toResponse(Brand brand) {
        User owner = userRepository.findById(brand.getOwnerUserId())
                .orElseThrow(() -> new IllegalArgumentException("브랜드 소유자를 찾을 수 없습니다."));
        return BrandContractResponse.from(brand, owner);
    }
}
