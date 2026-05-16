/*
DB 관련 설명
- 펀딩 기능은 아래 DB 테이블을 사용합니다.
  1) catalog_product: 펀딩 상품의 기본 정보입니다. sale_type='FUNDING'인 상품이 펀딩 대상입니다.
  2) catalog_product_option: 펀딩 참여 시 선택하는 색상/사이즈 옵션입니다.
  3) trade_funding_campaign: 목표 금액, 현재 금액, 시작일, 종료일, 펀딩 상태를 저장합니다.
  4) trade_funding_participation: 사용자의 펀딩 참여 내역을 저장합니다.
- 셀러 등록은 product + campaign을 동시에 만들고, 관리자가 승인해야 사용자 펀딩 목록에 노출됩니다.
*/
package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.FundingCampaignResponse;
import com.reown.backend.trade.dto.FundingCreateRequest;
import com.reown.backend.trade.dto.FundingParticipateRequest;
import com.reown.backend.trade.dto.FundingParticipateResponse;
import com.reown.backend.trade.dto.FundingParticipationResponse;
import com.reown.backend.trade.dto.FundingProductCreateRequest;
import com.reown.backend.trade.service.FundingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fundings")
@RequiredArgsConstructor
public class FundingController {

    private final FundingService fundingService;

    @PostMapping("/seller")
    public FundingCampaignResponse createSellerFundingProduct(
            @Valid @RequestBody FundingProductCreateRequest request
    ) {
        return fundingService.createSellerFundingProduct(request);
    }

    @GetMapping("/seller")
    public List<FundingCampaignResponse> getSellerFundings(
            @RequestParam Long brandId,
            @RequestParam(required = false) String status
    ) {
        return fundingService.getSellerFundings(brandId, status);
    }

    @GetMapping("/admin")
    public List<FundingCampaignResponse> getAdminFundings(
            @RequestParam(required = false) String status
    ) {
        return fundingService.getAdminFundings(status);
    }

    @PatchMapping("/admin/{campaignId}/approve")
    public FundingCampaignResponse approveFunding(
            @PathVariable Long campaignId
    ) {
        return fundingService.approveFunding(campaignId);
    }

    @PatchMapping("/admin/{campaignId}/reject")
    public FundingCampaignResponse rejectFunding(
            @PathVariable Long campaignId
    ) {
        return fundingService.rejectFunding(campaignId);
    }

    @PostMapping
    public FundingCampaignResponse createFunding(
            @Valid @RequestBody FundingCreateRequest request
    ) {
        return fundingService.createFunding(request);
    }

    @GetMapping
    public List<FundingCampaignResponse> getFundings(
            @RequestParam(required = false) String status
    ) {
        return fundingService.getFundings(status);
    }

    @GetMapping("/{campaignId}")
    public FundingCampaignResponse getFundingDetail(
            @PathVariable Long campaignId
    ) {
        return fundingService.getFundingDetail(campaignId);
    }

    @PostMapping("/{campaignId}/participate")
    public FundingParticipateResponse participate(
            @PathVariable Long campaignId,
            @Valid @RequestBody FundingParticipateRequest request
    ) {
        return fundingService.participate(campaignId, request);
    }

    @PatchMapping("/participations/{participationId}/cancel")
    public FundingParticipateResponse cancelParticipation(
            @PathVariable Long participationId,
            @RequestParam Long userId
    ) {
        return fundingService.cancelParticipation(participationId, userId);
    }

    @GetMapping("/{campaignId}/participations")
    public List<FundingParticipationResponse> getParticipationsByCampaign(
            @PathVariable Long campaignId
    ) {
        return fundingService.getParticipationsByCampaign(campaignId);
    }

    @GetMapping("/users/{userId}/participations")
    public List<FundingParticipationResponse> getParticipationsByUser(
            @PathVariable Long userId
    ) {
        return fundingService.getParticipationsByUser(userId);
    }

    @PatchMapping("/{campaignId}/cancel")
    public FundingCampaignResponse cancelFunding(
            @PathVariable Long campaignId
    ) {
        return fundingService.cancelFunding(campaignId);
    }
}
