package com.reown.backend.catalog.controller;

import com.reown.backend.catalog.dto.ProductCreateRequest;
import com.reown.backend.catalog.dto.ProductDetailResponse;
import com.reown.backend.catalog.dto.ProductOptionCreateRequest;
import com.reown.backend.catalog.dto.ProductOptionResponse;
import com.reown.backend.catalog.dto.ProductUpdateRequest;
import com.reown.backend.catalog.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductAdminController {

    private final CatalogService catalogService;

    @PostMapping
    public ProductDetailResponse createProduct(
            @Valid @RequestBody ProductCreateRequest request
    ) {
        return catalogService.createProduct(request);
    }

    @PutMapping("/{productId}")
    public ProductDetailResponse updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductUpdateRequest request
    ) {
        return catalogService.updateProduct(productId, request);
    }

    @DeleteMapping("/{productId}")
    public Map<String, String> deleteProduct(
            @PathVariable Long productId
    ) {
        catalogService.deleteProduct(productId);

        return Map.of(
                "message", "상품이 삭제 처리되었습니다.",
                "productId", String.valueOf(productId)
        );
    }

    @PostMapping("/{productId}/options")
    public ProductOptionResponse addProductOption(
            @PathVariable Long productId,
            @Valid @RequestBody ProductOptionCreateRequest request
    ) {
        return catalogService.addProductOption(productId, request);
    }
}