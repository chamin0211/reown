package com.reown.backend.catalog.dto;

import com.reown.backend.catalog.entity.Category;

public record CategoryResponse(
        Long categoryId,
        Long parentId,
        String name
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getParentId(),
                category.getName()
        );
    }
}