package com.reown.backend.catalog.controller;

import com.reown.backend.catalog.dto.ProductCreateRequest;
import com.reown.backend.catalog.dto.ProductDetailResponse;
import com.reown.backend.catalog.dto.ProductListResponse;
import com.reown.backend.catalog.dto.ProductUpdateRequest;
import com.reown.backend.catalog.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/{productId}")
    public ProductDetailResponse updateSellerProduct(
            @RequestParam Long brandId,
            @PathVariable Long productId,
            @RequestBody ProductUpdateRequest request
    ) {
        return catalogService.updateSellerProduct(brandId, productId, request);
    }

    @DeleteMapping("/{productId}")
    public Map<String, String> deleteSellerProduct(
            @RequestParam Long brandId,
            @PathVariable Long productId
    ) {
        catalogService.deleteSellerProduct(brandId, productId);

        return Map.of(
                "message", "상품이 삭제 처리되었습니다.",
                "productId", String.valueOf(productId)
        );
    }
}
