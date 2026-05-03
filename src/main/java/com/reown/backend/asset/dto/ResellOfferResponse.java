package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellPriceOffer;

import java.time.LocalDateTime;

public record ResellOfferResponse(
        Long offerId,
        Long resellId,
        Long buyerId,
        Integer offerPrice,
        String status,
        LocalDateTime createdAt
) {
    public static ResellOfferResponse from(AssetResellPriceOffer offer) {
        return new ResellOfferResponse(
                offer.getOfferId(),
                offer.getResellId(),
                offer.getBuyerId(),
                offer.getOfferPrice(),
                offer.getStatus(),
                offer.getCreatedAt()
        );
    }
}
