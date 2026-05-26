package com.reown.backend.catalog.dto;

public record CategoryAdminRequest(
        String name,
        Long parentId
) {
}
