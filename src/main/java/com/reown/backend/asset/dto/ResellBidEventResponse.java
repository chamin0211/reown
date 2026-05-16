package com.reown.backend.asset.dto;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellPriceOffer;

import java.time.LocalDateTime;

/**
 * WebSocket으로 프론트에 전달하는 리셀 실시간 이벤트 DTO입니다.
 * 구독 경로: /topic/resells/{resellId}
 */
public record ResellBidEventResponse(
        String type,
        Long resellId,
        Long offerId,
        Long buyerId,
        Integer offerPrice,
        Integer currentHighestBid,
        Long currentHighestBidderId,
        Integer bidCount,
        String status,
        LocalDateTime auctionEndAt,
        LocalDateTime createdAt,
        String message
) {
    public static ResellBidEventResponse bidPlaced(AssetResellMarket resell, AssetResellPriceOffer offer) {
        return new ResellBidEventResponse(
                "BID_PLACED",
                resell.getResellId(),
                offer.getOfferId(),
                offer.getBuyerId(),
                offer.getOfferPrice(),
                resell.getCurrentHighestBid(),
                resell.getCurrentHighestBidderId(),
                resell.getBidCount(),
                resell.getStatus(),
                resell.getAuctionEndAt(),
                offer.getCreatedAt(),
                "새로운 최고 입찰이 등록되었습니다."
        );
    }

    public static ResellBidEventResponse statusChanged(AssetResellMarket resell, String type, String message) {
        return new ResellBidEventResponse(
                type,
                resell.getResellId(),
                null,
                resell.getCurrentHighestBidderId(),
                resell.getCurrentHighestBid(),
                resell.getCurrentHighestBid(),
                resell.getCurrentHighestBidderId(),
                resell.getBidCount(),
                resell.getStatus(),
                resell.getAuctionEndAt(),
                LocalDateTime.now(),
                message
        );
    }
}
