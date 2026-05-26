package com.reown.backend.brand.service;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.brand.dto.AdminSellerResponse;
import com.reown.backend.brand.dto.BrandApplyRequest;
import com.reown.backend.brand.dto.BrandResponse;
import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
import com.reown.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandService {

    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BrandResponse apply(BrandApplyRequest request) {
        User owner = userRepository.findById(request.ownerUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. userId=" + request.ownerUserId()));

        // 이미 셀러/디자이너가 아닌 일반 사용자가 셀러 입점 신청을 하는 경우,
        // 관리자 승인 전까지는 SELLER_PENDING 상태로 둡니다.
        if (owner.getRole() == UserRole.USER) {
            owner.changeRole(UserRole.SELLER_PENDING);
        }

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
        return approveWithRole(brandId, UserRole.SELLER);
    }

    @Transactional
    public BrandResponse approveAsDesigner(Long brandId) {
        // 호환용 API입니다. 신규 흐름에서는 입점 승인은 일반 셀러로만 처리하고,
        // 디자이너 권한은 전체 셀러 목록에서 별도로 부여합니다.
        return approveWithRole(brandId, UserRole.DESIGNER);
    }

    private BrandResponse approveWithRole(Long brandId, UserRole role) {
        Brand brand = getBrand(brandId);
        User owner = getOwner(brand);

        brand.approve();
        owner.changeRole(role);

        notificationService.notifyUser(
                owner.getUserId(),
                role == UserRole.DESIGNER ? "디자이너 셀러 승인 완료" : "셀러 입점 승인 완료",
                brand.getBrandName() + " 브랜드 입점이 승인되었습니다. 이제 셀러센터를 이용할 수 있습니다.",
                "SELLER_APPROVED",
                "/seller"
        );

        return BrandResponse.from(brand);
    }

    @Transactional
    public BrandResponse reject(Long brandId) {
        Brand brand = getBrand(brandId);
        User owner = getOwner(brand);

        brand.reject();

        // 셀러 회원가입 또는 입점 신청 단계에서 반려되면 일반 사용자로 되돌립니다.
        // 이미 승인된 셀러/디자이너가 다른 브랜드를 추가 신청한 경우까지 권한을 강제로 뺏지는 않습니다.
        if (owner.getRole() == UserRole.SELLER_PENDING) {
            owner.changeRole(UserRole.USER);
        }

        notificationService.notifyUser(
                owner.getUserId(),
                "셀러 입점 신청 반려",
                brand.getBrandName() + " 브랜드 입점 신청이 반려되었습니다. 입력 정보를 확인한 뒤 다시 신청해주세요.",
                "SELLER_REJECTED",
                "/login"
        );

        return BrandResponse.from(brand);
    }

    public List<AdminSellerResponse> getSellers() {
        return brandRepository.findByStatus("APPROVED")
                .stream()
                .sorted(Comparator.comparing(Brand::getBrandId).reversed())
                .map(brand -> AdminSellerResponse.from(brand, getOwner(brand)))
                .toList();
    }

    @Transactional
    public AdminSellerResponse grantDesignerRole(Long brandId) {
        Brand brand = getBrand(brandId);
        if (!"APPROVED".equalsIgnoreCase(brand.getStatus())) {
            throw new IllegalArgumentException("입점 승인된 셀러에게만 디자이너 권한을 부여할 수 있습니다.");
        }

        User owner = getOwner(brand);
        owner.changeRole(UserRole.DESIGNER);
        brand.approve();

        notificationService.notifyUser(
                owner.getUserId(),
                "디자이너 권한 부여",
                brand.getBrandName() + " 브랜드에 디자이너 한정판 등록 권한이 부여되었습니다.",
                "DESIGNER_GRANTED",
                "/seller/limited-editions"
        );

        return AdminSellerResponse.from(brand, owner);
    }

    @Transactional
    public AdminSellerResponse revokeDesignerRole(Long brandId) {
        Brand brand = getBrand(brandId);
        if (!"APPROVED".equalsIgnoreCase(brand.getStatus())) {
            throw new IllegalArgumentException("입점 승인된 셀러만 일반 셀러로 변경할 수 있습니다.");
        }

        User owner = getOwner(brand);
        owner.changeRole(UserRole.SELLER);
        brand.approve();

        notificationService.notifyUser(
                owner.getUserId(),
                "디자이너 권한 회수",
                brand.getBrandName() + " 브랜드의 디자이너 권한이 일반 셀러 권한으로 변경되었습니다.",
                "DESIGNER_REVOKED",
                "/seller"
        );

        return AdminSellerResponse.from(brand, owner);
    }

    private Brand getBrand(Long brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId));
    }

    private User getOwner(Brand brand) {
        return userRepository.findById(brand.getOwnerUserId())
                .orElseThrow(() -> new IllegalArgumentException("브랜드 소유자를 찾을 수 없습니다."));
    }
}
