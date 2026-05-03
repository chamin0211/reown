package com.reown.backend.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "catalog_product")
@Getter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "brand_id", nullable = false)
    private Long brandId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "weight_g")
    private Integer weightG;

    @Column(name = "max_purchase_per_user")
    private Integer maxPurchasePerUser;

    @Column(name = "sale_type")
    private String saleType;

    @Column(name = "status")
    private String status;

    @Column(name = "display_sort_order")
    private Integer displaySortOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Product(
            Long brandId,
            String name,
            String thumbnailUrl,
            Integer price,
            Integer weightG,
            Integer maxPurchasePerUser,
            String saleType,
            String status,
            Integer displaySortOrder
    ) {
        this.brandId = brandId;
        this.name = name;
        this.thumbnailUrl = thumbnailUrl;
        this.price = price;
        this.weightG = weightG;
        this.maxPurchasePerUser = maxPurchasePerUser;
        this.saleType = saleType;
        this.status = status;
        this.displaySortOrder = displaySortOrder;
        this.createdAt = LocalDateTime.now();
    }

    public void update(
            String name,
            String thumbnailUrl,
            Integer price,
            Integer weightG,
            Integer maxPurchasePerUser,
            String saleType,
            String status,
            Integer displaySortOrder
    ) {
        if (name != null) {
            this.name = name;
        }

        if (thumbnailUrl != null) {
            this.thumbnailUrl = thumbnailUrl;
        }

        if (price != null) {
            this.price = price;
        }

        if (weightG != null) {
            this.weightG = weightG;
        }

        if (maxPurchasePerUser != null) {
            this.maxPurchasePerUser = maxPurchasePerUser;
        }

        if (saleType != null) {
            this.saleType = saleType;
        }

        if (status != null) {
            this.status = status;
        }

        if (displaySortOrder != null) {
            this.displaySortOrder = displaySortOrder;
        }
    }

    public void delete() {
        this.status = "DELETED";
    }
}