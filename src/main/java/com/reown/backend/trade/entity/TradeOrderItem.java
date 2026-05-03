package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trade_order_item")
@Getter
@NoArgsConstructor
public class TradeOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Integer unitPrice;

    @Column(name = "item_status")
    private String itemStatus;

    public TradeOrderItem(
            Long orderId,
            Long optionId,
            Integer quantity,
            Integer unitPrice
    ) {
        this.orderId = orderId;
        this.optionId = optionId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.itemStatus = "ORDERED";
    }
}
