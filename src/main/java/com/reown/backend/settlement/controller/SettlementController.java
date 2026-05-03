package com.reown.backend.settlement.controller;

import com.reown.backend.settlement.dto.SettlementCreateRequest;
import com.reown.backend.settlement.dto.SettlementResponse;
import com.reown.backend.settlement.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @PostMapping("/api/admin/settlements")
    public SettlementResponse createSettlement(
            @RequestBody SettlementCreateRequest request
    ) {
        return settlementService.createSettlement(request);
    }

    @GetMapping("/api/admin/settlements")
    public List<SettlementResponse> getSettlements(
            @RequestParam(required = false) String status
    ) {
        return settlementService.getSettlements(status);
    }

    @GetMapping("/api/admin/settlements/{settlementId}")
    public SettlementResponse getSettlement(
            @PathVariable Long settlementId
    ) {
        return settlementService.getSettlement(settlementId);
    }

    @PatchMapping("/api/admin/settlements/{settlementId}/complete")
    public SettlementResponse completeSettlement(
            @PathVariable Long settlementId
    ) {
        return settlementService.completeSettlement(settlementId);
    }

    @GetMapping("/api/brands/{brandId}/settlements")
    public List<SettlementResponse> getSettlementsByBrand(
            @PathVariable Long brandId
    ) {
        return settlementService.getSettlementsByBrand(brandId);
    }
}
