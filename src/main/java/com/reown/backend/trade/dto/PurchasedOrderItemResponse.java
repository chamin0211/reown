package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;

import java.time.LocalDateTime;

public record PurchasedOrderItemResponse(
        Long orderId,
        Long orderItemId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long optionId,
        String size,
        String color,
        Integer quantity,
        Integer unitPrice,
        Integer totalPrice,
        String itemStatus,
        LocalDateTime orderedAt
) {
    public static PurchasedOrderItemResponse from(
            TradeOrder order,
            TradeOrderItem orderItem,
            Product product,
            ProductOption option
    ) {
        return new PurchasedOrderItemResponse(
                order.getOrderId(),
                orderItem.getOrderItemId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                option.getOptionId(),
                option.getSize(),
                option.getColor(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getQuantity() * orderItem.getUnitPrice(),
                orderItem.getItemStatus(),
                order.getCreatedAt()
        );
    }
}