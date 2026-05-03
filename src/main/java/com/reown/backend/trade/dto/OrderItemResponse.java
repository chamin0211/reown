package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeOrderItem;

public record OrderItemResponse(
        Long orderItemId,
        Long productId,
        String productName,
        Long optionId,
        String size,
        String color,
        Integer quantity,
        Integer unitPrice,
        Integer totalPrice,
        String itemStatus
) {
    public static OrderItemResponse from(
            TradeOrderItem orderItem,
            Product product,
            ProductOption option
    ) {
        return new OrderItemResponse(
                orderItem.getOrderItemId(),
                product.getProductId(),
                product.getName(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getQuantity() * orderItem.getUnitPrice(),
                orderItem.getItemStatus()
        );
    }
}
