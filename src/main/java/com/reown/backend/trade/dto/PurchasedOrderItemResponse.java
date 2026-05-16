package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;

import java.time.LocalDateTime;

public record PurchasedOrderItemResponse(
        Long orderId,
        String orderNo,
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
        String orderStatus,
        String shippingStatus,
        String trackingNumber,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt,
        String shippingAddressSnapshot,
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
                order.getOrderNo(),
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
                order.getStatus(),
                order.getShippingStatus(),
                order.getTrackingNumber(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                order.getShippingAddressSnapshot(),
                order.getCreatedAt()
        );
    }
}
