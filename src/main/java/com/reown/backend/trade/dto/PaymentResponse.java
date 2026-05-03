package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradePayment;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long paymentId,
        Long orderId,
        String pgTid,
        String paymentMethod,
        Integer amount,
        String status,
        LocalDateTime paidAt
) {
    public static PaymentResponse from(TradePayment payment) {
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrderId(),
                payment.getPgTid(),
                payment.getPaymentMethod(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidAt()
        );
    }
}