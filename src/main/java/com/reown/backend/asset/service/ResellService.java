package com.reown.backend.asset.service;

import com.reown.backend.asset.dto.*;
import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellPriceOffer;
import com.reown.backend.asset.entity.AssetResellTransaction;
import com.reown.backend.asset.repository.AssetResellMarketRepository;
import com.reown.backend.asset.repository.AssetResellPriceOfferRepository;
import com.reown.backend.asset.repository.AssetResellTransactionRepository;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;
import com.reown.backend.trade.repository.TradeOrderItemRepository;
import com.reown.backend.trade.repository.TradeOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResellService {

    private final AssetResellMarketRepository resellMarketRepository;
    private final AssetResellPriceOfferRepository offerRepository;
    private final AssetResellTransactionRepository transactionRepository;

    private final TradeOrderRepository orderRepository;
    private final TradeOrderItemRepository orderItemRepository;

    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;

    @Transactional
    public ResellResponse createResell(ResellCreateRequest request) {
        TradeOrderItem orderItem = orderItemRepository.findById(request.orderItemId())
                .orElseThrow(() -> new IllegalArgumentException("주문 상품을 찾을 수 없습니다. orderItemId=" + request.orderItemId()));

        TradeOrder order = orderRepository.findById(orderItem.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderItem.getOrderId()));

        if (!order.getUserId().equals(request.sellerId())) {
            throw new IllegalArgumentException("본인이 구매한 상품만 리셀 등록할 수 있습니다.");
        }

        if (!"PAID".equals(order.getStatus())) {
            throw new IllegalArgumentException("결제 완료된 상품만 리셀 등록할 수 있습니다.");
        }

        if (resellMarketRepository.existsByOrderItemId(request.orderItemId())) {
            throw new IllegalArgumentException("이미 리셀 등록된 주문 상품입니다.");
        }

        ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));

        Product product = productRepository.findById(option.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

        AssetResellMarket resell = new AssetResellMarket(
                orderItem.getOrderItemId(),
                request.sellerId(),
                product.getProductId(),
                option.getOptionId(),
                request.resellPrice(),
                request.conditionDescription()
        );

        AssetResellMarket savedResell = resellMarketRepository.save(resell);

        return ResellResponse.from(savedResell, product, option);
    }

    public List<ResellResponse> getResells() {
        return resellMarketRepository.findByStatus("ON_SALE")
                .stream()
                .map(this::toResellResponse)
                .toList();
    }

    public ResellResponse getResellDetail(Long resellId) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        return toResellResponse(resell);
    }

    public List<ResellResponse> getSellerResells(Long sellerId) {
        return resellMarketRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::toResellResponse)
                .toList();
    }

    public List<ResellOfferResponse> getOffersByResellId(Long resellId) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        return offerRepository.findByResellIdOrderByCreatedAtDesc(resell.getResellId())
                .stream()
                .map(ResellOfferResponse::from)
                .toList();
    }

    public List<ResellOfferResponse> getBuyerOffers(Long buyerId) {
        return offerRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(ResellOfferResponse::from)
                .toList();
    }

    public List<ResellTransactionDetailResponse> getBuyerTransactions(Long buyerId) {
        return transactionRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream()
                .map(transaction -> {
                    AssetResellMarket resell = resellMarketRepository.findById(transaction.getResellId())
                            .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + transaction.getResellId()));

                    Product product = productRepository.findById(resell.getProductId())
                            .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));

                    ProductOption option = productOptionRepository.findById(resell.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + resell.getOptionId()));

                    return ResellTransactionDetailResponse.from(transaction, resell, product, option);
                })
                .toList();
    }

    @Transactional
    public ResellOfferResponse createOffer(Long resellId, ResellOfferCreateRequest request) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("판매 중인 리셀 상품에만 가격 제안할 수 있습니다.");
        }

        if (resell.getSellerId().equals(request.buyerId())) {
            throw new IllegalArgumentException("본인 상품에는 가격 제안을 할 수 없습니다.");
        }

        AssetResellPriceOffer offer = new AssetResellPriceOffer(
                resell.getResellId(),
                request.buyerId(),
                request.offerPrice()
        );

        AssetResellPriceOffer savedOffer = offerRepository.save(offer);

        return ResellOfferResponse.from(savedOffer);
    }

    @Transactional
    public ResellTransactionResponse purchaseResell(Long resellId, ResellPurchaseRequest request) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("이미 판매 완료되었거나 판매 중이 아닌 상품입니다.");
        }

        if (resell.getSellerId().equals(request.buyerId())) {
            throw new IllegalArgumentException("본인 상품은 구매할 수 없습니다.");
        }

        int platformFee = calculatePlatformFee(resell.getResellPrice());

        resell.markSold();

        AssetResellTransaction transaction = new AssetResellTransaction(
                resell.getResellId(),
                request.buyerId(),
                resell.getResellPrice(),
                platformFee
        );

        AssetResellTransaction savedTransaction = transactionRepository.save(transaction);

        return ResellTransactionResponse.from(savedTransaction);
    }

    @Transactional
    public ResellResponse updateResell(Long resellId, ResellUpdateRequest request) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        if (!resell.getSellerId().equals(request.sellerId())) {
            throw new IllegalArgumentException("본인이 등록한 리셀 상품만 수정할 수 있습니다.");
        }

        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("판매 중인 리셀 상품만 수정할 수 있습니다.");
        }

        resell.updateInfo(
                request.resellPrice(),
                request.conditionDescription()
        );

        return toResellResponse(resell);
    }

    @Transactional
    public ResellResponse cancelResell(Long resellId, Long sellerId) {
        AssetResellMarket resell = resellMarketRepository.findById(resellId)
                .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + resellId));

        if (!resell.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("본인이 등록한 리셀 상품만 판매 취소할 수 있습니다.");
        }

        if (!"ON_SALE".equals(resell.getStatus())) {
            throw new IllegalArgumentException("판매 중인 리셀 상품만 판매 취소할 수 있습니다.");
        }

        resell.markCanceled();

        return toResellResponse(resell);
    }

    private ResellResponse toResellResponse(AssetResellMarket resell) {
        Product product = productRepository.findById(resell.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));

        ProductOption option = productOptionRepository.findById(resell.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + resell.getOptionId()));

        return ResellResponse.from(resell, product, option);
    }

    private int calculatePlatformFee(Integer resellPrice) {
        if (resellPrice == null) {
            return 0;
        }

        return (int) Math.floor(resellPrice * 0.05);
    }
}