package com.reown.backend.asset.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_resell_market")
@Getter
@NoArgsConstructor
public class AssetResellMarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resell_id")
    private Long resellId;

    /**
     * 프리미엄 입찰형 리셀은 반드시 일반 구매내역에서 출발하지 않아도 됩니다.
     * 구매 기반 리셀일 때만 주문상품 ID가 들어가고, 관리자/플랫폼 검수 상품은 null일 수 있습니다.
     */
    @Column(name = "order_item_id")
    private Long orderItemId;

    /** 판매자 또는 플랫폼 보유자 ID. 관리자 등록 MVP에서는 0 또는 관리자가 지정한 사용자 ID를 사용할 수 있습니다. */
    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    /** 기존 컬럼 호환용. 프리미엄 리셀에서는 즉시 구매가로 사용합니다. */
    @Column(name = "resell_price", nullable = false)
    private Integer resellPrice;

    @Column(name = "condition_description", columnDefinition = "TEXT")
    private String conditionDescription;

    /** WAITING, ON_SALE, SOLD, REJECTED, CANCELED, EXPIRED */
    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /** 입찰 시작가 */
    @Column(name = "start_price")
    private Integer startPrice;

    /** 현재 최고 입찰가 */
    @Column(name = "current_highest_bid")
    private Integer currentHighestBid;

    /** 현재 최고 입찰자 */
    @Column(name = "current_highest_bidder_id")
    private Long currentHighestBidderId;

    /** 최소 입찰 단위 */
    @Column(name = "min_bid_increment")
    private Integer minBidIncrement;

    /** 총 입찰 수 */
    @Column(name = "bid_count")
    private Integer bidCount;

    /** 입찰 마감일 */
    @Column(name = "auction_end_at")
    private LocalDateTime auctionEndAt;

    /** 희소성 등급: RARE, LIMITED, ARCHIVE, COLLECTOR 등 */
    @Column(name = "rarity_grade")
    private String rarityGrade;

    /** 관리자 검수 내용 */
    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote;

    /** 왜 프리미엄 리셀인지에 대한 설명 */
    @Column(name = "premium_reason", columnDefinition = "TEXT")
    private String premiumReason;

    public AssetResellMarket(
            Long sellerId,
            Long productId,
            Long optionId,
            Integer startPrice,
            Integer instantBuyPrice,
            Integer minBidIncrement,
            LocalDateTime auctionEndAt,
            String rarityGrade,
            String conditionDescription,
            String verificationNote,
            String premiumReason
    ) {
        this.orderItemId = null;
        this.sellerId = sellerId != null ? sellerId : 0L;
        this.productId = productId;
        this.optionId = optionId;
        this.startPrice = startPrice;
        this.currentHighestBid = 0;
        this.currentHighestBidderId = null;
        this.minBidIncrement = minBidIncrement != null && minBidIncrement > 0 ? minBidIncrement : 1000;
        this.bidCount = 0;
        this.auctionEndAt = auctionEndAt;
        this.rarityGrade = rarityGrade != null ? rarityGrade : "ARCHIVE";
        this.resellPrice = instantBuyPrice != null && instantBuyPrice > 0 ? instantBuyPrice : startPrice;
        this.conditionDescription = conditionDescription;
        this.verificationNote = verificationNote;
        this.premiumReason = premiumReason;
        this.status = "WAITING";
        this.createdAt = LocalDateTime.now();
    }

    /** 기존 구매기반 리셀 생성자 호환용. 새 입찰형 구조에서는 사용을 권장하지 않습니다. */
    public AssetResellMarket(
            Long orderItemId,
            Long sellerId,
            Long productId,
            Long optionId,
            Integer resellPrice,
            String conditionDescription
    ) {
        this.orderItemId = orderItemId;
        this.sellerId = sellerId;
        this.productId = productId;
        this.optionId = optionId;
        this.resellPrice = resellPrice;
        this.startPrice = resellPrice;
        this.currentHighestBid = 0;
        this.currentHighestBidderId = null;
        this.minBidIncrement = 1000;
        this.bidCount = 0;
        this.auctionEndAt = LocalDateTime.now().plusDays(7);
        this.rarityGrade = "ARCHIVE";
        this.conditionDescription = conditionDescription;
        this.verificationNote = "관리자 검수 필요";
        this.premiumReason = "구매 기반 리셀 등록 상품";
        this.status = "WAITING";
        this.createdAt = LocalDateTime.now();
    }

    public void approve() {
        if (!"WAITING".equals(this.status) && !"REJECTED".equals(this.status)) {
            throw new IllegalArgumentException("검수 대기 또는 반려 상태의 리셀 상품만 승인할 수 있습니다.");
        }
        this.status = "ON_SALE";
    }

    public void reject() {
        if ("SOLD".equals(this.status)) {
            throw new IllegalArgumentException("이미 거래 완료된 리셀 상품은 반려할 수 없습니다.");
        }
        this.status = "REJECTED";
    }

    public void markSold(Integer finalPrice, Long buyerId) {
        if (!"ON_SALE".equals(this.status)) {
            throw new IllegalArgumentException("입찰 진행 중인 리셀 상품만 거래 완료 처리할 수 있습니다.");
        }
        this.status = "SOLD";
        if (finalPrice != null) {
            this.currentHighestBid = finalPrice;
        }
        this.currentHighestBidderId = buyerId;
    }

    public void markExpired() {
        if ("ON_SALE".equals(this.status)) {
            this.status = "EXPIRED";
        }
    }

    public void markCanceled() {
        if ("SOLD".equals(this.status)) {
            throw new IllegalArgumentException("이미 거래 완료된 리셀 상품은 취소할 수 없습니다.");
        }
        this.status = "CANCELED";
    }

    public void applyBid(Integer bidPrice, Long bidderId) {
        if (!"ON_SALE".equals(this.status)) {
            throw new IllegalArgumentException("입찰 진행 중인 상품에만 입찰할 수 있습니다.");
        }
        this.currentHighestBid = bidPrice;
        this.currentHighestBidderId = bidderId;
        this.bidCount = this.bidCount == null ? 1 : this.bidCount + 1;
    }

    public void updatePremiumInfo(
            Integer startPrice,
            Integer instantBuyPrice,
            Integer minBidIncrement,
            LocalDateTime auctionEndAt,
            String rarityGrade,
            String conditionDescription,
            String verificationNote,
            String premiumReason
    ) {
        if ("SOLD".equals(this.status)) {
            throw new IllegalArgumentException("거래 완료된 리셀 상품은 수정할 수 없습니다.");
        }
        this.startPrice = startPrice;
        this.resellPrice = instantBuyPrice;
        this.minBidIncrement = minBidIncrement != null && minBidIncrement > 0 ? minBidIncrement : 1000;
        this.auctionEndAt = auctionEndAt;
        this.rarityGrade = rarityGrade;
        this.conditionDescription = conditionDescription;
        this.verificationNote = verificationNote;
        this.premiumReason = premiumReason;
        this.status = "WAITING";
    }
}
