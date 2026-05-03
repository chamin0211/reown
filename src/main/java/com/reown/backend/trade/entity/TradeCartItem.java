package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trade_cart_item")
@Getter
@NoArgsConstructor
public class TradeCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    public TradeCartItem(Long userId, Long optionId, Integer quantity) {
        this.userId = userId;
        this.optionId = optionId;
        this.quantity = quantity;
    }

    public void increaseQuantity(Integer quantity) {
        this.quantity += quantity;
    }
}