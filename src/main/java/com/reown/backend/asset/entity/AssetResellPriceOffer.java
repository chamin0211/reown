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

    /** LEADING, OUTBID, ACCEPTED, REJECTED, CANCELED */
    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AssetResellPriceOffer(Long resellId, Long buyerId, Integer offerPrice) {
        this.resellId = resellId;
        this.buyerId = buyerId;
        this.offerPrice = offerPrice;
        this.status = "LEADING";
        this.createdAt = LocalDateTime.now();
    }

    public void markLeading() {
        if (!"ACCEPTED".equals(this.status) && !"REJECTED".equals(this.status) && !"CANCELED".equals(this.status)) {
            this.status = "LEADING";
        }
    }

    public void markOutbid() {
        if ("LEADING".equals(this.status) || "PENDING".equals(this.status)) {
            this.status = "OUTBID";
        }
    }

    public void accept() {
        if (!"LEADING".equals(this.status) && !"PENDING".equals(this.status)) {
            throw new IllegalArgumentException("현재 최고 입찰만 낙찰 처리할 수 있습니다.");
        }
        this.status = "ACCEPTED";
    }

    public void reject() {
        if (!"ACCEPTED".equals(this.status)) {
            this.status = "REJECTED";
        }
    }
}
