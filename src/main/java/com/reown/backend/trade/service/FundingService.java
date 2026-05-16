/*
DB 관련 설명
- 펀딩 등록/승인/참여/취소/상태 전환 흐름
  1) 셀러가 펀딩 상품을 등록하면 catalog_product에는 sale_type='FUNDING', status='WAITING'으로 저장됩니다.
  2) 동시에 trade_funding_campaign에는 funding_status='WAITING'으로 저장됩니다.
  3) 관리자가 승인하면 catalog_product.status='ON_SALE', trade_funding_campaign.funding_status='OPEN'으로 변경됩니다.
  4) 사용자가 참여하면 trade_funding_participation에 저장되고 current_amount와 progressRate가 갱신됩니다.
  5) current_amount >= target_amount이면 funding_status='SUCCESS'로 자동 변경됩니다.
  6) end_date가 지났는데 목표 미달이면 funding_status='FAILED'로 자동 변경됩니다.
  7) 참여 취소는 OPEN 상태이고 종료일 전인 펀딩에서만 가능합니다.
*/
package com.reown.backend.trade.service;

import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.trade.dto.FundingCampaignResponse;
import com.reown.backend.trade.dto.FundingCreateRequest;
import com.reown.backend.trade.dto.FundingParticipateRequest;
import com.reown.backend.trade.dto.FundingParticipateResponse;
import com.reown.backend.trade.dto.FundingParticipationResponse;
import com.reown.backend.trade.dto.FundingProductCreateRequest;
import com.reown.backend.trade.dto.FundingUpdateCreateRequest;
import com.reown.backend.trade.dto.FundingUpdateResponse;
import com.reown.backend.trade.entity.TradeFundingCampaign;
import com.reown.backend.trade.entity.TradeFundingParticipation;
import com.reown.backend.trade.entity.TradeFundingUpdate;
import com.reown.backend.trade.repository.TradeFundingCampaignRepository;
import com.reown.backend.trade.repository.TradeFundingParticipationRepository;
import com.reown.backend.trade.repository.TradeFundingUpdateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FundingService {

    private static final String SALE_TYPE_FUNDING = "FUNDING";
    private static final String PRODUCT_STATUS_WAITING = "WAITING";
    private static final String PRODUCT_STATUS_ON_SALE = "ON_SALE";
    private static final String PRODUCT_STATUS_DELETED = "DELETED";
    private static final Set<String> USER_VISIBLE_FUNDING_STATUSES = Set.of(
            TradeFundingCampaign.STATUS_OPEN,
            TradeFundingCampaign.STATUS_SUCCESS
    );

    private final TradeFundingCampaignRepository fundingCampaignRepository;
    private final TradeFundingParticipationRepository participationRepository;
    private final TradeFundingUpdateRepository fundingUpdateRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final BrandRepository brandRepository;

    @Transactional
    public FundingCampaignResponse createSellerFundingProduct(FundingProductCreateRequest request) {
        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + request.brandId()));

        validateDate(request.startDate(), request.endDate());

        Product product = new Product(
                request.brandId(),
                request.name(),
                request.thumbnailUrl(),
                request.price(),
                request.categoryName(),
                request.description(),
                null,
                request.maxPurchasePerUser(),
                SALE_TYPE_FUNDING,
                PRODUCT_STATUS_WAITING,
                0
        );

        Product savedProduct = productRepository.save(product);

        ProductOption option = new ProductOption(
                savedProduct.getProductId(),
                normalizeText(request.size(), "Free"),
                normalizeText(request.color(), "기본"),
                normalizeColorHex(request.colorHex()),
                request.stockQuantity() != null ? Math.max(request.stockQuantity(), 0) : 0,
                request.safetyStock() != null ? Math.max(request.safetyStock(), 0) : 0,
                0
        );
        productOptionRepository.save(option);

        TradeFundingCampaign campaign = new TradeFundingCampaign(
                savedProduct.getProductId(),
                request.targetAmount(),
                normalizeStartDate(request.startDate()),
                normalizeEndDate(request.endDate()),
                TradeFundingCampaign.STATUS_WAITING
        );

        TradeFundingCampaign savedCampaign = fundingCampaignRepository.save(campaign);

        return FundingCampaignResponse.from(savedCampaign, savedProduct, brand.getBrandName(), 0L);
    }

    @Transactional
    public FundingCampaignResponse createFunding(FundingCreateRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + request.productId()));

        validateFundingProduct(product);
        validateDate(request.startDate(), request.endDate());

        String status = request.fundingStatus() != null ? request.fundingStatus() : TradeFundingCampaign.STATUS_WAITING;

        TradeFundingCampaign campaign = new TradeFundingCampaign(
                request.productId(),
                request.targetAmount(),
                request.startDate(),
                request.endDate(),
                status
        );

        TradeFundingCampaign savedCampaign = fundingCampaignRepository.save(campaign);
        savedCampaign.refreshLifecycleStatus(LocalDateTime.now());

        return toResponse(savedCampaign);
    }

    @Transactional
    public List<FundingCampaignResponse> getFundings(String status) {
        List<TradeFundingCampaign> campaigns;

        if (status == null || status.isBlank()) {
            campaigns = fundingCampaignRepository.findByFundingStatusInOrderByStartDateDesc(USER_VISIBLE_FUNDING_STATUSES);
        } else {
            campaigns = fundingCampaignRepository.findByFundingStatusOrderByStartDateDesc(status);
        }

        LocalDateTime now = LocalDateTime.now();
        return campaigns.stream()
                .peek(campaign -> campaign.refreshLifecycleStatus(now))
                .filter(campaign -> {
                    Product product = getProduct(campaign.getProductId());
                    return SALE_TYPE_FUNDING.equals(product.getSaleType())
                            && PRODUCT_STATUS_ON_SALE.equals(product.getStatus())
                            && USER_VISIBLE_FUNDING_STATUSES.contains(campaign.getFundingStatus());
                })
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<FundingCampaignResponse> getSellerFundings(Long brandId, String status) {
        if (!brandRepository.existsById(brandId)) {
            throw new IllegalArgumentException("브랜드를 찾을 수 없습니다. brandId=" + brandId);
        }

        LocalDateTime now = LocalDateTime.now();
        return getCampaignsByStatus(status).stream()
                .peek(campaign -> campaign.refreshLifecycleStatus(now))
                .filter(this::isManagementVisibleCampaign)
                .filter(campaign -> getProduct(campaign.getProductId()).getBrandId().equals(brandId))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<FundingCampaignResponse> getAdminFundings(String status) {
        LocalDateTime now = LocalDateTime.now();
        return getCampaignsByStatus(status).stream()
                .peek(campaign -> campaign.refreshLifecycleStatus(now))
                .filter(this::isManagementVisibleCampaign)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public FundingCampaignResponse approveFunding(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());
        validateFundingProduct(product);

        product.approve();
        campaign.approve(LocalDateTime.now());

        return toResponse(campaign);
    }

    @Transactional
    public FundingCampaignResponse rejectFunding(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());
        validateFundingProduct(product);

        product.reject();
        campaign.reject();

        return toResponse(campaign);
    }

    @Transactional
    public FundingCampaignResponse getFundingDetail(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        campaign.refreshLifecycleStatus(LocalDateTime.now());
        return toResponse(campaign);
    }

    @Transactional
    public FundingParticipateResponse participate(Long campaignId, FundingParticipateRequest request) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());
        LocalDateTime now = LocalDateTime.now();

        validateFundingProduct(product);
        if (!PRODUCT_STATUS_ON_SALE.equals(product.getStatus())) {
            throw new IllegalArgumentException("승인된 펀딩 상품만 참여할 수 있습니다. productStatus=" + product.getStatus());
        }

        campaign.refreshLifecycleStatus(now);
        if (!campaign.isOpenForParticipation(now)) {
            throw new IllegalArgumentException("현재 참여 가능한 펀딩이 아닙니다. fundingStatus=" + campaign.getFundingStatus());
        }

        Integer quantity = normalizeQuantity(request.quantity());
        validateMaxPurchasePerUser(campaign.getCampaignId(), request.userId(), product.getMaxPurchasePerUser(), quantity);

        Long optionId = validateOptionIfPresent(product.getProductId(), request.optionId());
        Integer unitPrice = product.getPrice();
        Integer participateAmount = unitPrice * quantity;

        campaign.participate(participateAmount, now);

        TradeFundingParticipation participation = new TradeFundingParticipation(
                campaign.getCampaignId(),
                request.userId(),
                optionId,
                quantity,
                unitPrice,
                participateAmount
        );
        TradeFundingParticipation savedParticipation = participationRepository.save(participation);

        FundingCampaignResponse campaignResponse = toResponse(campaign);

        return FundingParticipateResponse.from(
                request.userId(),
                participateAmount,
                savedParticipation,
                campaignResponse
        );
    }

    @Transactional
    public FundingParticipateResponse cancelParticipation(Long participationId, Long userId) {
        TradeFundingParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩 참여 내역을 찾을 수 없습니다. participationId=" + participationId));

        if (!participation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 펀딩 참여 내역만 취소할 수 있습니다.");
        }

        TradeFundingCampaign campaign = getCampaign(participation.getCampaignId());
        LocalDateTime now = LocalDateTime.now();
        campaign.refreshLifecycleStatus(now);

        if (!TradeFundingCampaign.STATUS_OPEN.equals(campaign.getFundingStatus())) {
            throw new IllegalArgumentException("진행 중인 펀딩만 취소할 수 있습니다. fundingStatus=" + campaign.getFundingStatus());
        }

        participation.cancel();
        campaign.cancelParticipation(participation.getAmount(), now);

        FundingCampaignResponse campaignResponse = toResponse(campaign);

        return FundingParticipateResponse.from(
                userId,
                participation.getAmount(),
                participation,
                campaignResponse
        );
    }

    @Transactional
    public FundingCampaignResponse cancelFunding(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());

        campaign.refreshLifecycleStatus(LocalDateTime.now());
        campaign.cancel();
        product.reject();

        return toResponse(campaign);
    }

    @Transactional
    public FundingCampaignResponse updateProductionStageBySeller(Long campaignId, Long brandId, String productionStage) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());

        validateFundingProduct(product);
        if (!product.getBrandId().equals(brandId)) {
            throw new IllegalArgumentException("본인 브랜드의 펀딩만 제작 단계를 변경할 수 있습니다.");
        }

        campaign.refreshLifecycleStatus(LocalDateTime.now());
        campaign.updateProductionStage(productionStage);

        return toResponse(campaign);
    }

    @Transactional
    public FundingCampaignResponse updateProductionStageByAdmin(Long campaignId, String productionStage) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());

        validateFundingProduct(product);
        campaign.refreshLifecycleStatus(LocalDateTime.now());
        campaign.updateProductionStage(productionStage);

        return toResponse(campaign);
    }


    public List<FundingUpdateResponse> getFundingUpdates(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        campaign.refreshLifecycleStatus(LocalDateTime.now());

        return fundingUpdateRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId)
                .stream()
                .map(FundingUpdateResponse::from)
                .toList();
    }

    @Transactional
    public FundingUpdateResponse createSellerFundingUpdate(Long campaignId, Long brandId, FundingUpdateCreateRequest request) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        Product product = getProduct(campaign.getProductId());

        validateFundingProduct(product);
        if (!product.getBrandId().equals(brandId)) {
            throw new IllegalArgumentException("본인 브랜드의 펀딩에만 공지를 등록할 수 있습니다.");
        }

        if (PRODUCT_STATUS_DELETED.equals(product.getStatus())
                || TradeFundingCampaign.STATUS_CANCELED.equals(campaign.getFundingStatus())
                || TradeFundingCampaign.STATUS_REJECTED.equals(campaign.getFundingStatus())) {
            throw new IllegalArgumentException("취소/반려/삭제된 펀딩에는 공지를 등록할 수 없습니다.");
        }

        campaign.refreshLifecycleStatus(LocalDateTime.now());

        TradeFundingUpdate update = new TradeFundingUpdate(
                campaignId,
                brandId,
                request.updateType(),
                request.title(),
                request.content(),
                normalizeUpdateStage(request.productionStage(), campaign)
        );

        return FundingUpdateResponse.from(fundingUpdateRepository.save(update));
    }

    @Transactional
    public List<FundingParticipationResponse> getParticipationsByCampaign(Long campaignId) {
        TradeFundingCampaign campaign = getCampaign(campaignId);
        campaign.refreshLifecycleStatus(LocalDateTime.now());

        return participationRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId)
                .stream()
                .map(FundingParticipationResponse::from)
                .toList();
    }

    @Transactional
    public List<FundingParticipationResponse> getParticipationsByUser(Long userId) {
        List<TradeFundingParticipation> participations = participationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        participations.forEach(participation -> getCampaign(participation.getCampaignId()).refreshLifecycleStatus(LocalDateTime.now()));

        return participations.stream()
                .map(FundingParticipationResponse::from)
                .toList();
    }

    private List<TradeFundingCampaign> getCampaignsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return fundingCampaignRepository.findAllByOrderByStartDateDesc();
        }
        return fundingCampaignRepository.findByFundingStatusOrderByStartDateDesc(status);
    }

    private FundingCampaignResponse toResponse(TradeFundingCampaign campaign) {
        Product product = getProduct(campaign.getProductId());
        Long participantCount = participationRepository.countActiveByCampaignId(campaign.getCampaignId());
        return FundingCampaignResponse.from(campaign, product, getBrandName(product.getBrandId()), participantCount);
    }

    private boolean isManagementVisibleCampaign(TradeFundingCampaign campaign) {
        Product product = getProduct(campaign.getProductId());

        if (!SALE_TYPE_FUNDING.equals(product.getSaleType())) {
            return false;
        }

        if (PRODUCT_STATUS_DELETED.equals(product.getStatus())) {
            return false;
        }

        return !TradeFundingCampaign.STATUS_CANCELED.equals(campaign.getFundingStatus());
    }

    private TradeFundingCampaign getCampaign(Long campaignId) {
        return fundingCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + campaignId));
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));
    }

    private String getBrandName(Long brandId) {
        return brandRepository.findById(brandId)
                .map(Brand::getBrandName)
                .orElse("Brand #" + brandId);
    }

    private void validateDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("펀딩 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

    private LocalDateTime normalizeStartDate(LocalDateTime value) {
        return value != null ? value : LocalDate.now().atStartOfDay();
    }

    private LocalDateTime normalizeEndDate(LocalDateTime value) {
        return value != null ? value : LocalDate.now().plusDays(30).atTime(23, 59, 59);
    }

    private void validateFundingProduct(Product product) {
        if (!SALE_TYPE_FUNDING.equals(product.getSaleType())) {
            throw new IllegalArgumentException("펀딩 상품만 처리할 수 있습니다. saleType=" + product.getSaleType());
        }
    }

    private Integer normalizeQuantity(Integer quantity) {
        if (quantity == null) {
            return 1;
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("펀딩 참여 수량은 1개 이상이어야 합니다.");
        }

        return quantity;
    }

    private void validateMaxPurchasePerUser(Long campaignId, Long userId, Integer maxPurchasePerUser, Integer requestQuantity) {
        if (maxPurchasePerUser == null || maxPurchasePerUser <= 0) {
            return;
        }

        Long activeQuantity = participationRepository.sumActiveQuantityByCampaignIdAndUserId(campaignId, userId);
        long alreadyParticipated = activeQuantity != null ? activeQuantity : 0L;
        long nextTotalQuantity = alreadyParticipated + requestQuantity;

        if (nextTotalQuantity > maxPurchasePerUser) {
            long remainingQuantity = Math.max(0, maxPurchasePerUser - alreadyParticipated);
            throw new IllegalArgumentException(
                    "1인 최대 참여 수량은 " + maxPurchasePerUser + "개입니다. "
                            + "이미 참여한 수량은 " + alreadyParticipated + "개이고, "
                            + "추가 가능 수량은 " + remainingQuantity + "개입니다."
            );
        }
    }

    private Long validateOptionIfPresent(Long productId, Long optionId) {
        if (optionId == null) {
            return null;
        }

        ProductOption option = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + optionId));

        if (!option.getProductId().equals(productId)) {
            throw new IllegalArgumentException("해당 펀딩 상품의 옵션이 아닙니다. optionId=" + optionId);
        }

        return option.getOptionId();
    }


    private String normalizeUpdateStage(String requestedStage, TradeFundingCampaign campaign) {
        if (requestedStage != null && !requestedStage.isBlank()) {
            return requestedStage.trim();
        }

        String currentStage = campaign.getProductionStageValue();
        if (currentStage == null || TradeFundingCampaign.STAGE_NOT_STARTED.equals(currentStage)) {
            return null;
        }
        return currentStage;
    }

    private String normalizeText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String normalizeColorHex(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
