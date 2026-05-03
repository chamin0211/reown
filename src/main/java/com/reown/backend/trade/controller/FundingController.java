package com.reown.backend.trade.controller;

import com.reown.backend.trade.dto.FundingCampaignResponse;
import com.reown.backend.trade.dto.FundingCreateRequest;
import com.reown.backend.trade.dto.FundingParticipateRequest;
import com.reown.backend.trade.dto.FundingParticipateResponse;
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

    @PatchMapping("/{campaignId}/cancel")
    public FundingCampaignResponse cancelFunding(
            @PathVariable Long campaignId
    ) {
        return fundingService.cancelFunding(campaignId);
    }
}
