package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record FundingCreateRequest(
        @NotNull
        Long productId,

        @NotNull
        @Positive
        Integer targetAmount,

        LocalDateTime startDate,
        LocalDateTime endDate,
        String fundingStatus
) {
}