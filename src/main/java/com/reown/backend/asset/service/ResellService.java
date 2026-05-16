package com.reown.backend.asset.service;

import com.reown.backend.asset.dto.*;
import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellPriceOffer;
import com.reown.backend.asset.entity.AssetResellTransaction;
import com.reown.backend.asset.repository.AssetResellMarketRepository;
import com.reown.backend.asset.repository.AssetResellPriceOfferRepository;
import com.reown.backend.asset.repository.AssetResellTransactionRepository;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResellService {

    private static final Set<String> MARKET_VISIBLE_STATUSES = Set.of("ON_SALE", "SOLD");

    private final AssetResellMarketRepository resellMarketRepository;
    private final AssetResellPriceOfferRepository offerRepository;
    private final AssetResellTransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;

    /**
     * 셀러가 프리미엄 입찰형 리셀 상품을 등록합니다.
     *
     * 일반 중고거래처럼 구매내역에서 아무 상품이나 등록하는 방식이 아니라,
     * 셀러가 희소/아카이브 상품 정보를 입력하면 서버가 catalog_product와
     * catalog_product_option을 생성하고 asset_resell_market에는 WAITING 상태로 저장합니다.
     * 이후 관리자가 승인하면 사용자 리셀 마켓에 노출됩니다.
     */
    @Transactional
    public ResellResponse createResell(ResellCreateRequest request) {
        Long sellerId = requirePositiveLong(request.sellerId(), "셀러 ID");
        int startPrice = positiveOrThrow(request.startPrice(), "입찰 시작가");
        int instantBuyPrice = positiveOrDefault(request.instantBuyPrice(), startPrice);
        if (instantBuyPrice < startPrice) {
            throw new IllegalArgumentException("즉시 구매가는 입찰 시작가보다 낮을 수 없습니다.");
        }

        LocalDateTime auctionEndAt = request.auctionEndAt();
        if (auctionEndAt == null || !auctionEndAt.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("입찰 마감일은 현재 시각 이후여야 합니다.");
        }

        ProductOptionBundle bundle = resolveOrCreatePremiumArchiveProduct(request, startPrice);

        AssetResellMarket resell = new AssetResellMarket(
                sellerId,
                bundle.product().getProductId(),
                bundle.option().getOptionId(),
                startPrice,
                instantBuyPrice,
                request.minBidIncrement(),
                auctionEndAt,
                blankToDefault(request.rarityGrade(), "ARCHIVE"),
                request.conditionDescription(),
                request.verificationNote(),
                buildPremiumReason(request)
        );

        AssetResellMarket saved = resellMarketRepository.save(resell);
        return toResellResponse(saved);
    }

    /** 사용자 리셀 마켓에는 승인된 입찰 진행/거래 완료 상품만 노출합니다. */
    public List<ResellResponse> getResells() {
        return resellMarketRepository.findByStatusInOrderByCreatedAtDesc(MARKET_VISIBLE_STATUSES)
                .stream()
                .map(this::refreshExpiredIfNeededReadonly)
                .filter(resell -> MARKET_VISIBLE_STATUSES.contains(resell.getStatus()))
                .map(this::toResellResponse)
                .toList();
    }

    public List<ResellResponse> getAdminResells() {
        return resellMarketRepository.findByStatusInOrderByCreatedAtDesc(
                        List.of("WAITING", "ON_SALE", "SOLD", "REJECTED", "CANCELED", "EXPIRED")
                )
                .stream()
                .map(this::refreshExpiredIfNeededReadonly)
                .map(this::toResellResponse)
                .toList();
    }

    public ResellResponse getResellDetail(Long resellId) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        refreshExpiredIfNeededReadonly(resell);
        return toResellResponse(resell);
    }

    public List<ResellResponse> getSellerResells(Long sellerId) {
        return resellMarketRepository.findBySellerIdAndStatusInOrderByCreatedAtDesc(
                        sellerId,
                        List.of("WAITING", "ON_SALE", "SOLD", "REJECTED", "CANCELED", "EXPIRED")
                )
                .stream()
                .map(this::refreshExpiredIfNeededReadonly)
                .map(this::toResellResponse)
                .toList();
    }

    public List<ResellOfferResponse> getOffersByResellId(Long resellId) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        return offerRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                .stream()
                .map(ResellOfferResponse::from)
                .toList();
    }

    public List<ResellOfferDetailResponse> getBuyerOffers(Long buyerId) {
        return offerRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(this::toOfferDetailResponse)
                .toList();
    }

    public List<ResellTransactionDetailResponse> getBuyerTransactions(Long buyerId) {
        return transactionRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(this::toTransactionDetailResponse)
                .toList();
    }

    public List<ResellTransactionDetailResponse> getSellerTransactions(Long sellerId) {
        return resellMarketRepository.findBySellerIdAndStatusInOrderByCreatedAtDesc(sellerId, List.of("SOLD"))
                .stream()
                .flatMap(resell -> transactionRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                        .stream()
                        .map(this::toTransactionDetailResponse))
                .toList();
    }

    @Transactional
    public ResellResponse approveResell(Long resellId) {
        AssetResellMarket resell = findResell(resellId);
        resell.approve();
        productRepository.findById(resell.getProductId()).ifPresent(Product::approve);
        return toResellResponse(resell);
    }

    @Transactional
    public ResellResponse rejectResell(Long resellId) {
        AssetResellMarket resell = findResell(resellId);
        resell.reject();
        productRepository.findById(resell.getProductId()).ifPresent(Product::reject);
        rejectAllBids(resell.getResellId());
        return toResellResponse(resell);
    }

    @Transactional
    public ResellResponse updateResell(Long resellId, ResellUpdateRequest request) {
        AssetResellMarket resell = findResell(resellId);

        int startPrice = positiveOrThrow(request.startPrice(), "입찰 시작가");
        int instantBuyPrice = positiveOrDefault(request.instantBuyPrice(), startPrice);
        if (instantBuyPrice < startPrice) {
            throw new IllegalArgumentException("즉시 구매가는 입찰 시작가보다 낮을 수 없습니다.");
        }
        if (request.auctionEndAt() == null || !request.auctionEndAt().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("입찰 마감일은 현재 시각 이후여야 합니다.");
        }
        if (resell.getBidCount() != null && resell.getBidCount() > 0) {
            throw new IllegalArgumentException("이미 입찰이 있는 리셀 상품은 가격 정보를 수정할 수 없습니다.");
        }

        resell.updatePremiumInfo(
                startPrice,
                instantBuyPrice,
                request.minBidIncrement(),
                request.auctionEndAt(),
                blankToDefault(request.rarityGrade(), "ARCHIVE"),
                request.conditionDescription(),
                request.verificationNote(),
                request.premiumReason()
        );
        return toResellResponse(resell);
    }

    @Transactional
    public ResellResponse cancelResell(Long resellId, Long sellerId) {
        AssetResellMarket resell = findResell(resellId);
        if (sellerId != null && resell.getSellerId() != null && !resell.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("본인이 등록한 리셀 상품만 취소할 수 있습니다.");
        }
        resell.markCanceled();
        productRepository.findById(resell.getProductId()).ifPresent(Product::delete);
        rejectAllBids(resell.getResellId());
        return toResellResponse(resell);
    }

    /**
     * 입찰하기. 현재 최고가보다 최소 입찰 단위 이상 높아야 합니다.
     */
    @Transactional
    public ResellOfferResponse createOffer(Long resellId, ResellOfferCreateRequest request) {
        AssetResellMarket resell = findResell(resellId);
        ensureAuctionOpen(resell);

        if (resell.getSellerId() != null && resell.getSellerId().equals(request.buyerId())) {
            throw new IllegalArgumentException("본인 상품에는 입찰할 수 없습니다.");
        }

        int current = currentBidFloor(resell);
        int minNextBid = current + minIncrement(resell);
        if (request.offerPrice() < minNextBid) {
            throw new IllegalArgumentException("최소 입찰가는 " + minNextBid + "원입니다.");
        }

        offerRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                .forEach(AssetResellPriceOffer::markOutbid);

        AssetResellPriceOffer offer = new AssetResellPriceOffer(
                resell.getResellId(),
                request.buyerId(),
                request.offerPrice()
        );

        AssetResellPriceOffer saved = offerRepository.save(offer);
        resell.applyBid(request.offerPrice(), request.buyerId());

        return ResellOfferResponse.from(saved);
    }

    /** 즉시 구매. 즉시 구매가로 바로 거래 완료 처리합니다. */
    @Transactional
    public ResellTransactionResponse purchaseResell(Long resellId, ResellPurchaseRequest request) {
        AssetResellMarket resell = findResell(resellId);
        ensureAuctionOpen(resell);

        if (resell.getSellerId() != null && resell.getSellerId().equals(request.buyerId())) {
            throw new IllegalArgumentException("본인 상품은 구매할 수 없습니다.");
        }

        int buyNowPrice = positiveOrDefault(resell.getResellPrice(), currentBidFloor(resell));
        resell.markSold(buyNowPrice, request.buyerId());
        rejectAllBids(resell.getResellId());

        AssetResellTransaction transaction = new AssetResellTransaction(
                resell.getResellId(),
                request.buyerId(),
                buyNowPrice,
                calculatePlatformFee(buyNowPrice)
        );
        return ResellTransactionResponse.from(transactionRepository.save(transaction));
    }

    /** 관리자가 현재 최고 입찰자를 낙찰 처리합니다. */
    @Transactional
    public ResellTransactionResponse closeAuction(Long resellId) {
        AssetResellMarket resell = findResell(resellId);
        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("입찰 진행 중인 리셀 상품만 낙찰 처리할 수 있습니다.");
        }

        AssetResellPriceOffer leadingOffer = offerRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                .stream()
                .filter(offer -> "LEADING".equals(offer.getStatus()) || "PENDING".equals(offer.getStatus()))
                .max(Comparator.comparing(AssetResellPriceOffer::getOfferPrice))
                .orElseThrow(() -> new IllegalArgumentException("낙찰 처리할 입찰 내역이 없습니다."));

        leadingOffer.accept();
        offerRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                .forEach(offer -> {
                    if (!offer.getOfferId().equals(leadingOffer.getOfferId())) {
                        offer.markOutbid();
                    }
                });

        resell.markSold(leadingOffer.getOfferPrice(), leadingOffer.getBuyerId());
        AssetResellTransaction transaction = new AssetResellTransaction(
                resell.getResellId(),
                leadingOffer.getBuyerId(),
                leadingOffer.getOfferPrice(),
                calculatePlatformFee(leadingOffer.getOfferPrice())
        );
        return ResellTransactionResponse.from(transactionRepository.save(transaction));
    }

    /** 구버전 엔드포인트 호환용. 판매자 수락 대신 관리자 낙찰과 같은 의미로 처리합니다. */
    @Transactional
    public ResellTransactionResponse acceptOffer(Long offerId, Long sellerId) {
        AssetResellPriceOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("입찰 내역을 찾을 수 없습니다. offerId=" + offerId));
        return closeAuction(offer.getResellId());
    }

    /** 신규 구조에서는 일반 구매내역에서 리셀 등록하지 않으므로 빈 목록을 반환합니다. */
    public List<ResellAvailableItemResponse> getAvailableItems(Long userId) {
        return List.of();
    }

    /**
     * 신규 프리미엄 리셀 상품 생성.
     * productId/optionId가 들어온 구버전 요청은 호환을 위해 기존 상품을 사용하지만,
     * 셀러 화면에서는 더 이상 ID를 직접 입력하지 않습니다.
     */
    private ProductOptionBundle resolveOrCreatePremiumArchiveProduct(ResellCreateRequest request, Integer startPrice) {
        if (request.productId() != null && request.optionId() != null) {
            validateProductAndOption(request.productId(), request.optionId());
            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + request.productId()));
            ProductOption option = productOptionRepository.findById(request.optionId())
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + request.optionId()));
            return new ProductOptionBundle(product, option);
        }

        String productName = request.productName();
        if (productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("프리미엄 리셀 상품명을 입력해주세요.");
        }

        Long brandId = request.brandId() != null && request.brandId() > 0 ? request.brandId() : 11L;
        Product product = productRepository.save(new Product(
                brandId,
                productName.trim(),
                blankToNull(request.thumbnailUrl()),
                startPrice,
                blankToDefault(request.categoryName(), "ARCHIVE"),
                blankToDefault(request.conditionDescription(), "관리자 검수 대기 중인 프리미엄 리셀 상품입니다."),
                1,
                0,
                "RESELL",
                "WAITING",
                0
        ));

        ProductOption option = productOptionRepository.save(new ProductOption(
                product.getProductId(),
                blankToDefault(request.size(), "Free"),
                blankToDefault(request.color(), "기본"),
                normalizeColorHex(request.color(), request.colorHex()),
                1,
                0,
                0
        ));

        return new ProductOptionBundle(product, option);
    }

    private String buildPremiumReason(ResellCreateRequest request) {
        String reason = request.premiumReason();
        String category = request.categoryName();
        if (category == null || category.isBlank()) {
            return reason;
        }
        if (reason == null || reason.isBlank()) {
            return "카테고리: " + category;
        }
        return reason + "\n카테고리: " + category;
    }

    private String normalizeColorHex(String color, String colorHex) {
        if (colorHex != null && !colorHex.isBlank()) {
            return colorHex.trim();
        }
        String source = color == null ? "" : color.toLowerCase();
        if (source.contains("블랙") || source.contains("black")) return "#000000";
        if (source.contains("화이트") || source.contains("white")) return "#FFFFFF";
        if (source.contains("아이보리") || source.contains("ivory")) return "#FFFFF0";
        if (source.contains("블루") || source.contains("blue")) return "#2563EB";
        if (source.contains("네이비") || source.contains("navy")) return "#1E3A8A";
        if (source.contains("그레이") || source.contains("gray") || source.contains("grey")) return "#9CA3AF";
        if (source.contains("베이지") || source.contains("beige")) return "#D6B98C";
        if (source.contains("브라운") || source.contains("brown")) return "#8B5A2B";
        if (source.contains("레드") || source.contains("red")) return "#DC2626";
        if (source.contains("핑크") || source.contains("pink")) return "#F9A8D4";
        if (source.contains("그린") || source.contains("green")) return "#16A34A";
        if (source.contains("카키") || source.contains("khaki")) return "#6B705C";
        return "#111827";
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private record ProductOptionBundle(Product product, ProductOption option) {
    }

    private void ensureAuctionOpen(AssetResellMarket resell) {
        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("현재 입찰 가능한 리셀 상품이 아닙니다.");
        }
        if (resell.getAuctionEndAt() != null && !resell.getAuctionEndAt().isAfter(LocalDateTime.now())) {
            resell.markExpired();
            throw new IllegalArgumentException("입찰이 마감된 상품입니다.");
        }
    }

    private AssetResellMarket refreshExpiredIfNeededReadonly(AssetResellMarket resell) {
        // 조회 성능/안정성을 위해 실제 상태 변경은 입찰/관리 액션에서 처리합니다.
        return resell;
    }

    private void rejectAllBids(Long resellId) {
        offerRepository.findByResellIdOrderByCreatedAtDesc(resellId)
                .forEach(AssetResellPriceOffer::reject);
    }

    private int currentBidFloor(AssetResellMarket resell) {
        int highest = resell.getCurrentHighestBid() != null ? resell.getCurrentHighestBid() : 0;
        if (highest > 0) return highest;
        return resell.getStartPrice() != null ? resell.getStartPrice() : resell.getResellPrice();
    }

    private int minIncrement(AssetResellMarket resell) {
        return resell.getMinBidIncrement() != null && resell.getMinBidIncrement() > 0
                ? resell.getMinBidIncrement()
                : 1000;
    }

    private Long requirePositiveLong(Long value, String label) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(label + "는 1 이상이어야 합니다.");
        }
        return value;
    }

    private int positiveOrThrow(Integer value, String label) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(label + "는 1원 이상이어야 합니다.");
        }
        return value;
    }

    private int positiveOrDefault(Integer value, Integer defaultValue) {
        if (value != null && value > 0) return value;
        if (defaultValue != null && defaultValue > 0) return defaultValue;
        return 0;
    }

    private String blankToDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private AssetResellMarket findResell(Long resellId) {
        return resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));
    }

    private void validateProductAndOption(Long productId, Long optionId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + productId));
        ProductOption option = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + optionId));
        if (!option.getProductId().equals(product.getProductId())) {
            throw new IllegalArgumentException("상품과 옵션 정보가 일치하지 않습니다.");
        }
        if ("DELETED".equals(product.getStatus()) || "REJECTED".equals(product.getStatus())) {
            throw new IllegalArgumentException("삭제 또는 반려된 상품은 리셀 마켓에 등록할 수 없습니다.");
        }
    }

    private ResellResponse toResellResponse(AssetResellMarket resell) {
        Product product = productRepository.findById(resell.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));
        ProductOption option = productOptionRepository.findById(resell.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + resell.getOptionId()));
        return ResellResponse.from(resell, product, option);
    }

    private ResellOfferDetailResponse toOfferDetailResponse(AssetResellPriceOffer offer) {
        AssetResellMarket resell = findResell(offer.getResellId());
        Product product = productRepository.findById(resell.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));
        ProductOption option = productOptionRepository.findById(resell.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + resell.getOptionId()));
        return ResellOfferDetailResponse.from(offer, resell, product, option);
    }

    private ResellTransactionDetailResponse toTransactionDetailResponse(AssetResellTransaction transaction) {
        AssetResellMarket resell = findResell(transaction.getResellId());
        Product product = productRepository.findById(resell.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));
        ProductOption option = productOptionRepository.findById(resell.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + resell.getOptionId()));
        return ResellTransactionDetailResponse.from(transaction, resell, product, option);
    }

    private int calculatePlatformFee(Integer price) {
        if (price == null) return 0;
        return (int) Math.floor(price * 0.05);
    }
}
