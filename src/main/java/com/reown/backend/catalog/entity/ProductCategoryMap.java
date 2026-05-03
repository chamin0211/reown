package com.reown.backend.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catalog_product_category_map")
@Getter
@NoArgsConstructor
public class ProductCategoryMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "map_id")
    private Long mapId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;
}