package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PortOnePaymentVerifyRequest(
        @NotNull
        Long orderId,

        @NotBlank
        String paymentId,

        Integer expectedAmount,

        String paymentMethod
) {
}
