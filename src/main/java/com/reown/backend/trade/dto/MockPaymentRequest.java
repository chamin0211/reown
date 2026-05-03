package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;

public record MockPaymentRequest(
        @NotNull
        Long orderId,

        String paymentMethod
) {
}