package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_payments")
@Getter
@NoArgsConstructor
public class TradePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "pg_tid")
    private String pgTid;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "status")
    private String status;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public TradePayment(
            Long orderId,
            String pgTid,
            String paymentMethod,
            Integer amount
    ) {
        this.orderId = orderId;
        this.pgTid = pgTid;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = "PAID";
        this.paidAt = LocalDateTime.now();
    }
}