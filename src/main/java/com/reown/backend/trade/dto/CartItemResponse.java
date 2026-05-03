package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeCartItem;

public record CartItemResponse(
        Long cartId,
        Long userId,
        Long productId,
        String productName,
        Long optionId,
        String size,
        String color,
        Integer quantity,
        Integer unitPrice,
        Integer totalPrice
) {
    public static CartItemResponse from(
            TradeCartItem cartItem,
            Product product,
            ProductOption option
    ) {
        Integer totalPrice = product.getPrice() * cartItem.getQuantity();

        return new CartItemResponse(
                cartItem.getCartId(),
                cartItem.getUserId(),
                product.getProductId(),
                product.getName(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                cartItem.getQuantity(),
                product.getPrice(),
                totalPrice
        );
    }
}
