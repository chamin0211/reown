package com.reown.backend.trade.dto;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;

import java.time.LocalDateTime;

public record SellerOrderItemResponse(
        Long orderId,
        String orderNo,
        Long userId,
        Integer orderTotalPaymentAmount,
        String orderStatus,
        String shippingStatus,
        String trackingNumber,
        String shippingAddressSnapshot,
        LocalDateTime orderedAt,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt,
        Long orderItemId,
        Long productId,
        String productName,
        String thumbnailUrl,
        Long brandId,
        Long optionId,
        String size,
        String color,
        Integer quantity,
        Integer unitPrice,
        Integer itemTotalPrice,
        String itemStatus
) {
    public static SellerOrderItemResponse from(
            TradeOrder order,
            TradeOrderItem orderItem,
            Product product,
            ProductOption option
    ) {
        return new SellerOrderItemResponse(
                order.getOrderId(),
                order.getOrderNo(),
                order.getUserId(),
                order.getTotalPaymentAmount(),
                order.getStatus(),
                order.getShippingStatus(),
                order.getTrackingNumber(),
                order.getShippingAddressSnapshot(),
                order.getCreatedAt(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                orderItem.getOrderItemId(),
                product.getProductId(),
                product.getName(),
                product.getThumbnailUrl(),
                product.getBrandId(),
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
