/*
DB 관련 설명
- 펀딩 참여 저장 흐름
  1) trade_funding_campaign에서 campaign_id로 펀딩 캠페인을 조회합니다.
  2) catalog_product에서 product_id로 상품 가격을 조회합니다.
  3) catalog_product_option에서 option_id를 검증합니다. 옵션이 없으면 null 참여도 허용합니다.
  4) 참여 금액은 product.price × quantity로 계산합니다.
  5) trade_funding_participation에 user_id, option_id, quantity, unit_price, amount를 저장합니다.
  6) trade_funding_campaign.current_amount를 증가시키고, 목표 금액 이상이면 funding_status를 SUCCESS로 변경합니다.
- 나중에 더미 SQL을 제거하고 판매자 등록 화면을 만들더라도,
  동일한 catalog_product / catalog_product_option / trade_funding_campaign 테이블에 저장하면 기존 API와 프론트를 그대로 사용할 수 있습니다.
*/
package com.reown.backend.trade.service;

import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
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
    private final ProductOptionRepository productOptionRepository;

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

        Product product = productRepository.findById(campaign.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + campaign.getProductId()));

        validateFundingProduct(product);

        Integer quantity = normalizeQuantity(request.quantity());
        Long optionId = validateOptionIfPresent(product.getProductId(), request.optionId());
        Integer unitPrice = product.getPrice();
        Integer participateAmount = unitPrice * quantity;

        campaign.participate(participateAmount, LocalDateTime.now());

        TradeFundingParticipation participation = new TradeFundingParticipation(
                campaign.getCampaignId(),
                request.userId(),
                optionId,
                quantity,
                unitPrice,
                participateAmount
        );
        TradeFundingParticipation savedParticipation = participationRepository.save(participation);

        FundingCampaignResponse campaignResponse = toResponse(campaign);

        return FundingParticipateResponse.from(
                request.userId(),
                participateAmount,
                savedParticipation,
                campaignResponse
        );
    }

    @Transactional
    public FundingParticipateResponse cancelParticipation(Long participationId, Long userId) {
        TradeFundingParticipation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalArgumentException("펀딩 참여 내역을 찾을 수 없습니다. participationId=" + participationId));

        if (!participation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 펀딩 참여 내역만 취소할 수 있습니다.");
        }

        TradeFundingCampaign campaign = fundingCampaignRepository.findById(participation.getCampaignId())
                .orElseThrow(() -> new IllegalArgumentException("펀딩을 찾을 수 없습니다. campaignId=" + participation.getCampaignId()));

        participation.cancel();
        campaign.cancelParticipation(participation.getAmount(), LocalDateTime.now());

        FundingCampaignResponse campaignResponse = toResponse(campaign);

        return FundingParticipateResponse.from(
                userId,
                participation.getAmount(),
                participation,
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

    private void validateFundingProduct(Product product) {
        if (!"FUNDING".equals(product.getSaleType())) {
            throw new IllegalArgumentException("펀딩 상품만 참여할 수 있습니다. saleType=" + product.getSaleType());
        }
    }

    private Integer normalizeQuantity(Integer quantity) {
        if (quantity == null) {
            return 1;
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("펀딩 참여 수량은 1개 이상이어야 합니다.");
        }

        return quantity;
    }

    private Long validateOptionIfPresent(Long productId, Long optionId) {
        if (optionId == null) {
            return null;
        }

        ProductOption option = productOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + optionId));

        if (!option.getProductId().equals(productId)) {
            throw new IllegalArgumentException("해당 펀딩 상품의 옵션이 아닙니다. optionId=" + optionId);
        }

        return option.getOptionId();
    }
}
