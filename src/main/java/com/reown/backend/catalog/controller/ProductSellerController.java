package com.reown.backend.catalog.controller;

import com.reown.backend.catalog.dto.ProductCreateRequest;
import com.reown.backend.catalog.dto.ProductDetailResponse;
import com.reown.backend.catalog.dto.ProductListResponse;
import com.reown.backend.catalog.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class ProductSellerController {

    private final CatalogService catalogService;

    @GetMapping
    public List<ProductListResponse> getSellerProducts(
            @RequestParam Long brandId,
            @RequestParam(required = false) String status
    ) {
        return catalogService.getSellerProducts(brandId, status);
    }

    @GetMapping("/{productId}")
    public ProductDetailResponse getSellerProductDetail(
            @RequestParam Long brandId,
            @PathVariable Long productId
    ) {
        return catalogService.getSellerProductDetail(brandId, productId);
    }

    @PostMapping
    public ProductDetailResponse createSellerProduct(
            @Valid @RequestBody ProductCreateRequest request
    ) {
        return catalogService.createSellerProduct(request);
    }
}
