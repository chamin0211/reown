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

    @Column(name = "shipping_status")
    private String shippingStatus;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

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
        this.shippingStatus = "NOT_STARTED";
        this.createdAt = LocalDateTime.now();
    }

    public void markPaid() {
        this.status = "PAID";
        this.shippingStatus = "READY";
    }

    public void prepareShipping() {
        if (!"PAID".equals(this.status)) {
            throw new IllegalArgumentException("결제 완료된 주문만 배송 준비 처리할 수 있습니다.");
        }
        this.shippingStatus = "PREPARING";
    }

    public void ship(String trackingNumber) {
        if (!"PAID".equals(this.status)) {
            throw new IllegalArgumentException("결제 완료된 주문만 출고 처리할 수 있습니다.");
        }
        if (!"READY".equals(this.shippingStatus) && !"PREPARING".equals(this.shippingStatus)) {
            throw new IllegalArgumentException("배송 준비 상태의 주문만 출고 처리할 수 있습니다.");
        }
        this.shippingStatus = "SHIPPED";
        this.trackingNumber = trackingNumber;
        this.shippedAt = LocalDateTime.now();
    }

    public void deliver() {
        if (!"SHIPPED".equals(this.shippingStatus)) {
            throw new IllegalArgumentException("출고된 주문만 배송 완료 처리할 수 있습니다.");
        }
        this.shippingStatus = "DELIVERED";
        this.deliveredAt = LocalDateTime.now();
    }
}
