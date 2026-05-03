package com.reown.backend.asset.controller;

import com.reown.backend.asset.dto.*;
import com.reown.backend.asset.service.ResellService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resells")
@RequiredArgsConstructor
public class ResellController {

    private final ResellService resellService;

    @PostMapping
    public ResellResponse createResell(
            @Valid @RequestBody ResellCreateRequest request
    ) {
        return resellService.createResell(request);
    }

    @GetMapping
    public List<ResellResponse> getResells() {
        return resellService.getResells();
    }

    @GetMapping("/{resellId}")
    public ResellResponse getResellDetail(
            @PathVariable Long resellId
    ) {
        return resellService.getResellDetail(resellId);
    }

    @PatchMapping("/{resellId}")
    public ResellResponse updateResell(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellUpdateRequest request
    ) {
        return resellService.updateResell(resellId, request);
    }

    @PatchMapping("/{resellId}/cancel")
    public ResellResponse cancelResell(
            @PathVariable Long resellId,
            @RequestParam Long sellerId
    ) {
        return resellService.cancelResell(resellId, sellerId);
    }

    @GetMapping("/sellers/{sellerId}")
    public List<ResellResponse> getSellerResells(
            @PathVariable Long sellerId
    ) {
        return resellService.getSellerResells(sellerId);
    }

    @GetMapping("/{resellId}/offers")
    public List<ResellOfferResponse> getOffersByResellId(
            @PathVariable Long resellId
    ) {
        return resellService.getOffersByResellId(resellId);
    }

    @GetMapping("/buyers/{buyerId}/offers")
    public List<ResellOfferResponse> getBuyerOffers(
            @PathVariable Long buyerId
    ) {
        return resellService.getBuyerOffers(buyerId);
    }

    @GetMapping("/buyers/{buyerId}/transactions")
    public List<ResellTransactionDetailResponse> getBuyerTransactions(
            @PathVariable Long buyerId
    ) {
        return resellService.getBuyerTransactions(buyerId);
    }

    @PostMapping("/{resellId}/offers")
    public ResellOfferResponse createOffer(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellOfferCreateRequest request
    ) {
        return resellService.createOffer(resellId, request);
    }

    @PostMapping("/{resellId}/purchase")
    public ResellTransactionResponse purchaseResell(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellPurchaseRequest request
    ) {
        return resellService.purchaseResell(resellId, request);
    }
}