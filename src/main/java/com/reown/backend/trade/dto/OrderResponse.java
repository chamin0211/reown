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
                order.getCreatedAt(),
                items
        );
    }
}