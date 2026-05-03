package com.reown.backend.asset.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_resell_market")
@Getter
@NoArgsConstructor
public class AssetResellMarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resell_id")
    private Long resellId;

    @Column(name = "order_item_id", nullable = false)
    private Long orderItemId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "option_id", nullable = false)
    private Long optionId;

    @Column(name = "resell_price", nullable = false)
    private Integer resellPrice;

    @Column(name = "condition_description", columnDefinition = "TEXT")
    private String conditionDescription;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AssetResellMarket(
            Long orderItemId,
            Long sellerId,
            Long productId,
            Long optionId,
            Integer resellPrice,
            String conditionDescription
    ) {
        this.orderItemId = orderItemId;
        this.sellerId = sellerId;
        this.productId = productId;
        this.optionId = optionId;
        this.resellPrice = resellPrice;
        this.conditionDescription = conditionDescription;
        this.status = "ON_SALE";
        this.createdAt = LocalDateTime.now();
    }

    public void markSold() {
        this.status = "SOLD";
    }

    public void updateInfo(Integer resellPrice, String conditionDescription) {
        this.resellPrice = resellPrice;
        this.conditionDescription = conditionDescription;
    }

    public void markCanceled() {
        this.status = "CANCELED";
    }
}