package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradeOrder;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        Long userId,
        String orderNo,
        Integer totalPaymentAmount,
        String shippingAddressSnapshot,
        String status,
        String shippingStatus,
        String trackingNumber,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(
            TradeOrder order,
            List<OrderItemResponse> items
    ) {
        return new OrderResponse(
                order.getOrderId(),
                order.getUserId(),
                order.getOrderNo(),
                order.getTotalPaymentAmount(),
                order.getShippingAddressSnapshot(),
                order.getStatus(),
                order.getShippingStatus(),
                order.getTrackingNumber(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                order.getCreatedAt(),
                items
        );
    }
}