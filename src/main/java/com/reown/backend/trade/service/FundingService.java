package com.reown.backend.trade.service;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.trade.dto.FundingCampaignResponse;
import com.reown.backend.trade.dto.FundingCreateRequest;
import com.reown.backend.trade.dto.FundingParticipateRequest;
import com.reown.backend.trade.dto.FundingParticipateResponse;
import com.reown.backend.trade.dto.FundingParticipationResponse;
import com.reown.backend.trade.entity.TradeFundingCampaign;
import com.reown.backend.trade.entity.TradeFundingParticipation;
import com.reown.backend.trade.repository.TradeFundingCampaignRepository;
import com.reown.backend.trade.repository.TradeFundingParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FundingService {

    private final TradeFundingCampaignRepository fundingCampaignRepository;
    private final TradeFundingParticipationRepository participationRepository;
    private final ProductRepository productRepository;

    @Transactional
    public FundingCampaignResponse createFunding(FundingCreateRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + request.productId()));

        validateDate(request.startDate(), request.endDate());

        String status = request.fundingStatus() != null ? request.fundingStatus() : "OPEN";

        TradeFundingCampaign campaign = new TradeFundingCampaign(
                request.productId(),
                request.targetAmount(),
                request.startDate(),
                request.endDate(),
                status
        );

        TradeFundingCampaign savedCampaign = fundingCampaignRepository.save(campaign);

        return FundingCampaignResponse.from(savedCampaign, product);
    }

    public List<FundingCampaignResponse> getFundings(String status) {
        List<TradeFundingCampaign> campaigns;

        if (status == null || status.isBlank()) {
            campaigns = fundingCampaignRepository.findAllByOrderByStartDateDesc();
        } else {
            campaigns = fundingCampaignRepository.findByFundingStatusOrderByStartDateDesc(status);
        }

        return campaigns.stream()
                .map(this::toResponse)
                .toList();
    }

    public FundingCampaignResponse getFundingDetail(Long campaignId) {
        TradeFundingCampaign campaign = fundingCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + campaignId));

        return toResponse(campaign);
    }

    @Transactional
    public FundingParticipateResponse participate(Long campaignId, FundingParticipateRequest request) {
        TradeFundingCampaign campaign = fundingCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + campaignId));

        campaign.participate(request.amount(), LocalDateTime.now());

        TradeFundingParticipation participation = new TradeFundingParticipation(
                campaign.getCampaignId(),
                request.userId(),
                request.amount()
        );
        participationRepository.save(participation);

        FundingCampaignResponse campaignResponse = toResponse(campaign);

        return FundingParticipateResponse.from(
                request.userId(),
                request.amount(),
                campaignResponse
        );
    }

    @Transactional
    public FundingCampaignResponse cancelFunding(Long campaignId) {
        TradeFundingCampaign campaign = fundingCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + campaignId));

        campaign.cancel();

        return toResponse(campaign);
    }


    public List<FundingParticipationResponse> getParticipationsByCampaign(Long campaignId) {
        if (!fundingCampaignRepository.existsById(campaignId)) {
            throw new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + campaignId);
        }

        return participationRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId)
                .stream()
                .map(FundingParticipationResponse::from)
                .toList();
    }

    public List<FundingParticipationResponse> getParticipationsByUser(Long userId) {
        return participationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(FundingParticipationResponse::from)
                .toList();
    }

    private FundingCampaignResponse toResponse(TradeFundingCampaign campaign) {
        Product product = productRepository.findById(campaign.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + campaign.getProductId()));

        return FundingCampaignResponse.from(campaign, product);
    }

    private void validateDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("펀딩 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }
}
