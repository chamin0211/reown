package com.reown.backend.asset.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_resell_transaction")
@Getter
@NoArgsConstructor
public class AssetResellTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "resell_id", nullable = false)
    private Long resellId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "resell_price", nullable = false)
    private Integer resellPrice;

    @Column(name = "platform_fee")
    private Integer platformFee;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AssetResellTransaction(
            Long resellId,
            Long buyerId,
            Integer resellPrice,
            Integer platformFee
    ) {
        this.resellId = resellId;
        this.buyerId = buyerId;
        this.resellPrice = resellPrice;
        this.platformFee = platformFee;
        this.status = "COMPLETED";
        this.createdAt = LocalDateTime.now();
    }
}