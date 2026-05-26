package com.reown.backend.brand.controller;

import com.reown.backend.brand.dto.BrandContractResponse;
import com.reown.backend.brand.dto.BrandContractUpdateRequest;
import com.reown.backend.brand.service.BrandContractAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/brands")
public class BrandContractAdminController {

    private final BrandContractAdminService brandContractAdminService;

    @GetMapping("/contracts")
    public List<BrandContractResponse> getContracts() {
        return brandContractAdminService.getContracts();
    }

    @PatchMapping("/{brandId}/contract")
    public BrandContractResponse updateContract(@PathVariable Long brandId, @RequestBody BrandContractUpdateRequest request) {
        return brandContractAdminService.updateContract(brandId, request);
    }
}
