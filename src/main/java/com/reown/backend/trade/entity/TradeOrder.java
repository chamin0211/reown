package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_orders")
@Getter
@NoArgsConstructor
public class TradeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "order_no", nullable = false)
    private String orderNo;

    @Column(name = "total_payment_amount", nullable = false)
    private Integer totalPaymentAmount;

    @Column(name = "shipping_address_snapshot", columnDefinition = "TEXT")
    private String shippingAddressSnapshot;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public TradeOrder(
            Long userId,
            String orderNo,
            Integer totalPaymentAmount,
            String shippingAddressSnapshot
    ) {
        this.userId = userId;
        this.orderNo = orderNo;
        this.totalPaymentAmount = totalPaymentAmount;
        this.shippingAddressSnapshot = shippingAddressSnapshot;
        this.status = "CREATED";
        this.createdAt = LocalDateTime.now();
    }

    public void markPaid() {
        this.status = "PAID";
    }
}
