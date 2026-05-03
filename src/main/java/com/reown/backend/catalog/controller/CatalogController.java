package com.reown.backend.catalog.controller;

import com.reown.backend.catalog.dto.CategoryResponse;
import com.reown.backend.catalog.dto.ProductDetailResponse;
import com.reown.backend.catalog.dto.ProductListResponse;
import com.reown.backend.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/categories")
    public List<CategoryResponse> getCategories() {
        return catalogService.getCategories();
    }

    @GetMapping("/products")
    public List<ProductListResponse> getProducts() {
        return catalogService.getProducts();
    }

    @GetMapping("/products/{productId}")
    public ProductDetailResponse getProductDetail(@PathVariable Long productId) {
        return catalogService.getProductDetail(productId);
    }

    @GetMapping("/brands/{brandId}/products")
    public List<ProductListResponse> getProductsByBrand(@PathVariable Long brandId) {
        return catalogService.getProductsByBrand(brandId);
    }
}