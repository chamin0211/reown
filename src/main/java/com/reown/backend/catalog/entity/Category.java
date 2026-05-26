package com.reown.backend.catalog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catalog_category")
@Getter
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "name", nullable = false)
    private String name;

    public Category(String name, Long parentId) {
        this.name = name;
        this.parentId = parentId;
    }

    public void update(String name, Long parentId) {
        if (name != null && !name.isBlank()) {
            this.name = name.trim();
        }
        this.parentId = parentId;
    }
}
