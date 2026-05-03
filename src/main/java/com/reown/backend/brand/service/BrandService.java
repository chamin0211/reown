package com.reown.backend.brand.service;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.brand.dto.BrandApplyRequest;
import com.reown.backend.brand.dto.BrandResponse;
import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandService {

    private final BrandRepository brandRepository;
    private final UserRepository userRepository;

    @Transactional
    public BrandResponse apply(BrandApplyRequest request) {
        userRepository.findById(request.ownerUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. userId=" + request.ownerUserId()));

        Brand brand = new Brand(
                request.ownerUserId(),
                request.brandName(),
                request.brandLogoUrl(),
                request.businessNumber(),
                request.settlementCycle() != null ? request.settlementCycle() : "MONTHLY"
        );

        return BrandResponse.from(brandRepository.save(brand));
    }

    public List<BrandResponse> getBrands(String status) {
        List<Brand> brands = status == null ? brandRepository.findAll() : brandRepository.findByStatus(status);
        return brands.stream().map(BrandResponse::from).toList();
    }

    @Transactional
    public BrandResponse approve(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId));
        User owner = userRepository.findById(brand.getOwnerUserId())
                .orElseThrow(() -> new IllegalArgumentException("브랜드 소유자를 찾을 수 없습니다."));

        brand.approve();
        owner.changeRole(UserRole.SELLER);

        return BrandResponse.from(brand);
    }

    @Transactional
    public BrandResponse reject(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId));
        brand.reject();
        return BrandResponse.from(brand);
    }
}
