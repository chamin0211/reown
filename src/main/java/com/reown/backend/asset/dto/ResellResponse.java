package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;

import java.time.LocalDateTime;

public record ResellResponse(
        Long resellId,
        Long orderItemId,
        Long sellerId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,

        /** 기존 호환용: 즉시 구매가 */
        Integer resellPrice,

        Integer startPrice,
        Integer instantBuyPrice,
        Integer currentHighestBid,
        Long currentHighestBidderId,
        Integer minBidIncrement,
        Integer bidCount,
        LocalDateTime auctionEndAt,
        String rarityGrade,
        String conditionDescription,
        String verificationNote,
        String premiumReason,
        String status,
        LocalDateTime createdAt
) {
    public static ResellResponse from(AssetResellMarket resell, Product product, ProductOption option) {
        Integer start = resell.getStartPrice() != null ? resell.getStartPrice() : resell.getResellPrice();
        Integer instant = resell.getResellPrice();
        Integer highest = resell.getCurrentHighestBid() != null ? resell.getCurrentHighestBid() : 0;
        Integer increment = resell.getMinBidIncrement() != null ? resell.getMinBidIncrement() : 1000;
        Integer count = resell.getBidCount() != null ? resell.getBidCount() : 0;

        return new ResellResponse(
                resell.getResellId(),
                resell.getOrderItemId(),
                resell.getSellerId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                instant,
                start,
                instant,
                highest,
                resell.getCurrentHighestBidderId(),
                increment,
                count,
                resell.getAuctionEndAt(),
                resell.getRarityGrade(),
                resell.getConditionDescription(),
                resell.getVerificationNote(),
                resell.getPremiumReason(),
                resell.getStatus(),
                resell.getCreatedAt()
        );
    }
}
