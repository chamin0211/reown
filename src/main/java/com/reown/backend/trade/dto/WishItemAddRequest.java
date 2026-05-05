package com.reown.backend.trade.dto;

public record WishItemAddRequest(
        Long userId,
        Long productId
) {
}