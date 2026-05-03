package com.reown.backend.trade.dto;

import jakarta.validation.constraints.NotNull;

public record OrderCreateRequest(
        @NotNull
        Long userId,

        String shippingAddressSnapshot
) {
}