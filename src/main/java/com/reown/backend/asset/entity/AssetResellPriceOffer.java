package com.reown.backend.asset.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_resell_price_offer")
@Getter
@NoArgsConstructor
public class AssetResellPriceOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    @Column(name = "resell_id", nullable = false)
    private Long resellId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "offer_price", nullable = false)
    private Integer offerPrice;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AssetResellPriceOffer(
            Long resellId,
            Long buyerId,
            Integer offerPrice
    ) {
        this.resellId = resellId;
        this.buyerId = buyerId;
        this.offerPrice = offerPrice;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }
}
