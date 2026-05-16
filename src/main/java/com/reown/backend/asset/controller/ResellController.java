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

    @GetMapping
    public List<ResellResponse> getResells() {
        return resellService.getResells();
    }

    @GetMapping("/admin")
    public List<ResellResponse> getAdminResells() {
        return resellService.getAdminResells();
    }

    @PostMapping
    public ResellResponse createResell(@Valid @RequestBody ResellCreateRequest request) {
        return resellService.createResell(request);
    }

    @GetMapping("/{resellId}")
    public ResellResponse getResellDetail(@PathVariable Long resellId) {
        return resellService.getResellDetail(resellId);
    }

    @PatchMapping("/{resellId}")
    public ResellResponse updateResell(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellUpdateRequest request
    ) {
        return resellService.updateResell(resellId, request);
    }

    @PatchMapping("/{resellId}/approve")
    public ResellResponse approveResell(@PathVariable Long resellId) {
        return resellService.approveResell(resellId);
    }

    @PatchMapping("/{resellId}/reject")
    public ResellResponse rejectResell(@PathVariable Long resellId) {
        return resellService.rejectResell(resellId);
    }

    @PatchMapping("/{resellId}/cancel")
    public ResellResponse cancelResell(
            @PathVariable Long resellId,
            @RequestParam(required = false) Long sellerId
    ) {
        return resellService.cancelResell(resellId, sellerId);
    }

    @PostMapping("/{resellId}/offers")
    public ResellOfferResponse createOffer(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellOfferCreateRequest request
    ) {
        return resellService.createOffer(resellId, request);
    }

    @GetMapping("/{resellId}/offers")
    public List<ResellOfferResponse> getOffersByResellId(@PathVariable Long resellId) {
        return resellService.getOffersByResellId(resellId);
    }

    @PostMapping("/{resellId}/purchase")
    public ResellTransactionResponse purchaseResell(
            @PathVariable Long resellId,
            @Valid @RequestBody ResellPurchaseRequest request
    ) {
        return resellService.purchaseResell(resellId, request);
    }

    @PostMapping("/{resellId}/close")
    public ResellTransactionResponse closeAuction(@PathVariable Long resellId) {
        return resellService.closeAuction(resellId);
    }

    /** 구버전 호환용. 현재는 해당 입찰이 속한 리셀 상품의 최고 입찰을 낙찰 처리합니다. */
    @PostMapping("/offers/{offerId}/accept")
    public ResellTransactionResponse acceptOffer(
            @PathVariable Long offerId,
            @RequestParam(required = false) Long sellerId
    ) {
        return resellService.acceptOffer(offerId, sellerId);
    }

    @GetMapping("/buyers/{buyerId}/offers")
    public List<ResellOfferDetailResponse> getBuyerOffers(@PathVariable Long buyerId) {
        return resellService.getBuyerOffers(buyerId);
    }

    @GetMapping("/buyers/{buyerId}/transactions")
    public List<ResellTransactionDetailResponse> getBuyerTransactions(@PathVariable Long buyerId) {
        return resellService.getBuyerTransactions(buyerId);
    }

    @GetMapping("/sellers/{sellerId}")
    public List<ResellResponse> getSellerResells(@PathVariable Long sellerId) {
        return resellService.getSellerResells(sellerId);
    }

    @GetMapping("/sellers/{sellerId}/transactions")
    public List<ResellTransactionDetailResponse> getSellerTransactions(@PathVariable Long sellerId) {
        return resellService.getSellerTransactions(sellerId);
    }

    /** 신규 구조에서는 일반 구매내역에서 리셀 등록하지 않으므로 빈 목록을 반환합니다. */
    @GetMapping("/users/{userId}/available-items")
    public List<ResellAvailableItemResponse> getAvailableItems(@PathVariable Long userId) {
        return resellService.getAvailableItems(userId);
    }
}
