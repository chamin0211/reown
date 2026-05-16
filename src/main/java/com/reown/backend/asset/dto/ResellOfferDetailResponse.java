package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellPriceOffer;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;

import java.time.LocalDateTime;

public record ResellOfferDetailResponse(
        Long offerId,
        Long resellId,
        Long buyerId,
        Integer offerPrice,
        String offerStatus,
        Long sellerId,
        String resellStatus,
        Integer startPrice,
        Integer instantBuyPrice,
        Integer currentHighestBid,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        String rarityGrade,
        LocalDateTime auctionEndAt,
        LocalDateTime createdAt
) {
    public static ResellOfferDetailResponse from(
            AssetResellPriceOffer offer,
            AssetResellMarket resell,
            Product product,
            ProductOption option
    ) {
        return new ResellOfferDetailResponse(
                offer.getOfferId(),
                offer.getResellId(),
                offer.getBuyerId(),
                offer.getOfferPrice(),
                offer.getStatus(),
                resell.getSellerId(),
                resell.getStatus(),
                resell.getStartPrice(),
                resell.getResellPrice(),
                resell.getCurrentHighestBid(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                resell.getRarityGrade(),
                resell.getAuctionEndAt(),
                offer.getCreatedAt()
        );
    }
}
