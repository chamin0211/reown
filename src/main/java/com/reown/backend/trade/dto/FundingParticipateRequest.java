package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FundingParticipateRequest(
        @NotNull
        Long userId,

        @NotNull
        @Positive
        Integer amount
) {
}