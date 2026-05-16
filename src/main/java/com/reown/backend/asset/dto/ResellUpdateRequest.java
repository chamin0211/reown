package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record ResellUpdateRequest(
        Long sellerId,

        @NotNull
        @Positive
        Integer startPrice,

        @NotNull
        @Positive
        Integer instantBuyPrice,

        @Positive
        Integer minBidIncrement,

        @NotNull
        LocalDateTime auctionEndAt,

        String rarityGrade,

        String conditionDescription,

        String verificationNote,

        String premiumReason,

        /** 구버전 호환용 */
        Integer resellPrice
) {
}
