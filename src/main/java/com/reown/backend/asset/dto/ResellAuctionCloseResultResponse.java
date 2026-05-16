package com.reown.backend.asset.dto;

import java.time.LocalDateTime;

/**
 * 자동 경매 마감 스케줄러가 처리한 결과를 관리자 테스트용으로 확인하기 위한 DTO입니다.
 */
public record ResellAuctionCloseResultResponse(
        Long resellId,
        String previousStatus,
        String resultStatus,
        Long buyerId,
        Integer finalPrice,
        Long transactionId,
        String message,
        LocalDateTime processedAt
) {
    public static ResellAuctionCloseResultResponse sold(
            Long resellId,
            String previousStatus,
            Long buyerId,
            Integer finalPrice,
            Long transactionId
    ) {
        return new ResellAuctionCloseResultResponse(
                resellId,
                previousStatus,
                "SOLD",
                buyerId,
                finalPrice,
                transactionId,
                "마감 시간이 지나 최고 입찰자가 자동 낙찰되었습니다.",
                LocalDateTime.now()
        );
    }

    public static ResellAuctionCloseResultResponse expired(Long resellId, String previousStatus) {
        return new ResellAuctionCloseResultResponse(
                resellId,
                previousStatus,
                "EXPIRED",
                null,
                null,
                null,
                "마감 시간이 지났지만 입찰 내역이 없어 유찰 처리되었습니다.",
                LocalDateTime.now()
        );
    }
}
