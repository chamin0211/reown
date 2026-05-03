package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotNull;

public record ResellPurchaseRequest(
        @NotNull
        Long buyerId
) {
}