package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ResellOfferCreateRequest(
        @NotNull
        Long buyerId,

        @NotNull
        @Positive
        Integer offerPrice
) {
}
