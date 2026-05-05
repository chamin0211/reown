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

    public void updateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("장바구니 수량은 1개 이상이어야 합니다.");
        }

        this.quantity = quantity;
    }
}