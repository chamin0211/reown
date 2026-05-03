package com.reown.backend.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catalog_product_option")
@Getter
@NoArgsConstructor
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "size")
    private String size;

    @Column(name = "color")
    private String color;

    @Column(name = "color_hex")
    private String colorHex;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "safety_stock")
    private Integer safetyStock;

    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;

    public ProductOption(
            Long productId,
            String size,
            String color,
            String colorHex,
            Integer stockQuantity,
            Integer safetyStock,
            Integer reservedQuantity
    ) {
        this.productId = productId;
        this.size = size;
        this.color = color;
        this.colorHex = colorHex;
        this.stockQuantity = stockQuantity;
        this.safetyStock = safetyStock;
        this.reservedQuantity = reservedQuantity != null ? reservedQuantity : 0;
    }

    public void decreaseStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }

        if (this.stockQuantity == null || this.stockQuantity < quantity) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }

        this.stockQuantity -= quantity;
    }
}