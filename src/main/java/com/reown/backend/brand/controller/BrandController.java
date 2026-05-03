package com.reown.backend.brand.controller;

import com.reown.backend.brand.dto.BrandApplyRequest;
import com.reown.backend.brand.dto.BrandResponse;
import com.reown.backend.brand.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @PostMapping("/api/brands/apply")
    public BrandResponse apply(@Valid @RequestBody BrandApplyRequest request) {
        return brandService.apply(request);
    }

    @GetMapping("/api/admin/brands")
    public List<BrandResponse> getBrands(@RequestParam(required = false) String status) {
        return brandService.getBrands(status);
    }

    @PatchMapping("/api/admin/brands/{brandId}/approve")
    public BrandResponse approve(@PathVariable Long brandId) {
        return brandService.approve(brandId);
    }

    @PatchMapping("/api/admin/brands/{brandId}/reject")
    public BrandResponse reject(@PathVariable Long brandId) {
        return brandService.reject(brandId);
    }
}
