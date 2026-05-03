package com.reown.backend.settlement.service;

import com.reown.backend.asset.entity.AssetResellMarket;
import com.reown.backend.asset.entity.AssetResellTransaction;
import com.reown.backend.asset.repository.AssetResellMarketRepository;
import com.reown.backend.asset.repository.AssetResellTransactionRepository;
import com.reown.backend.catalog.entity.Product;
import com.reown.backend.catalog.entity.ProductOption;
import com.reown.backend.catalog.repository.ProductOptionRepository;
import com.reown.backend.catalog.repository.ProductRepository;
import com.reown.backend.settlement.dto.SettlementCreateRequest;
import com.reown.backend.settlement.dto.SettlementResponse;
import com.reown.backend.settlement.entity.Settlement;
import com.reown.backend.settlement.repository.SettlementRepository;
import com.reown.backend.trade.entity.TradeOrder;
import com.reown.backend.trade.entity.TradeOrderItem;
import com.reown.backend.trade.repository.TradeOrderItemRepository;
import com.reown.backend.trade.repository.TradeOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final TradeOrderRepository orderRepository;
    private final TradeOrderItemRepository orderItemRepository;
    private final ProductOptionRepository productOptionRepository;
    private final ProductRepository productRepository;
    private final AssetResellMarketRepository resellMarketRepository;
    private final AssetResellTransactionRepository resellTransactionRepository;

    @Transactional
    public SettlementResponse createSettlement(SettlementCreateRequest request) {
        String type = request.settlementType() == null || request.settlementType().isBlank()
                ? "ALL"
                : request.settlementType();

        int totalSalesAmount = 0;
        int platformFee = 0;

        if ("ALL".equals(type) || "NORMAL_ORDER".equals(type)) {
            int normalSales = calculateNormalOrderSales(request.brandId(), request.periodStart(), request.periodEnd());
            totalSalesAmount += normalSales;
            platformFee += calculateNormalOrderFee(normalSales);
        }

        if ("ALL".equals(type) || "RESELL".equals(type)) {
            ResellSettlementAmount resellAmount = calculateResellSales(request.brandId(), request.periodStart(), request.periodEnd());
            totalSalesAmount += resellAmount.totalSalesAmount();
            platformFee += resellAmount.platformFee();
        }

        int settlementAmount = totalSalesAmount - platformFee;

        Settlement settlement = new Settlement(
                request.brandId(),
                type,
                totalSalesAmount,
                platformFee,
                settlementAmount,
                request.periodStart(),
                request.periodEnd()
        );

        return SettlementResponse.from(settlementRepository.save(settlement));
    }

    public List<SettlementResponse> getSettlements(String status) {
        List<Settlement> settlements;
        if (status == null || status.isBlank()) {
            settlements = settlementRepository.findAll();
        } else {
            settlements = settlementRepository.findByStatusOrderByCreatedAtDesc(status);
        }

        return settlements.stream()
                .map(SettlementResponse::from)
                .toList();
    }

    public List<SettlementResponse> getSettlementsByBrand(Long brandId) {
        return settlementRepository.findByBrandIdOrderByCreatedAtDesc(brandId)
                .stream()
                .map(SettlementResponse::from)
                .toList();
    }

    public SettlementResponse getSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다. settlementId=" + settlementId));

        return SettlementResponse.from(settlement);
    }

    @Transactional
    public SettlementResponse completeSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다. settlementId=" + settlementId));

        if ("COMPLETED".equals(settlement.getStatus())) {
            throw new IllegalArgumentException("이미 완료된 정산입니다.");
        }

        settlement.complete();

        return SettlementResponse.from(settlement);
    }

    private int calculateNormalOrderSales(Long brandId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        int total = 0;

        for (TradeOrder order : orderRepository.findAll()) {
            if (!isPaidOrder(order)) {
                continue;
            }
            if (!isWithinPeriod(order.getCreatedAt(), periodStart, periodEnd)) {
                continue;
            }

            List<TradeOrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());
            for (TradeOrderItem orderItem : orderItems) {
                ProductOption option = productOptionRepository.findById(orderItem.getOptionId())
                        .orElseThrow(() -> new IllegalArgumentException("상품 옵션을 찾을 수 없습니다. optionId=" + orderItem.getOptionId()));
                Product product = productRepository.findById(option.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + option.getProductId()));

                if (product.getBrandId().equals(brandId)) {
                    total += orderItem.getUnitPrice() * orderItem.getQuantity();
                }
            }
        }

        return total;
    }

    private ResellSettlementAmount calculateResellSales(Long brandId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        int total = 0;
        int fee = 0;

        for (AssetResellTransaction transaction : resellTransactionRepository.findAll()) {
            if (!"COMPLETED".equals(transaction.getStatus())) {
                continue;
            }
            if (!isWithinPeriod(transaction.getCreatedAt(), periodStart, periodEnd)) {
                continue;
            }

            AssetResellMarket resell = resellMarketRepository.findById(transaction.getResellId())
                    .orElseThrow(() -> new IllegalArgumentException("리셀 상품을 찾을 수 없습니다. resellId=" + transaction.getResellId()));
            Product product = productRepository.findById(resell.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. productId=" + resell.getProductId()));

            if (product.getBrandId().equals(brandId)) {
                total += transaction.getResellPrice();
                fee += transaction.getPlatformFee() != null ? transaction.getPlatformFee() : 0;
            }
        }

        return new ResellSettlementAmount(total, fee);
    }

    private boolean isPaidOrder(TradeOrder order) {
        return "PAID".equals(order.getStatus());
    }

    private boolean isWithinPeriod(LocalDateTime target, LocalDateTime start, LocalDateTime end) {
        if (target == null) {
            return true;
        }
        if (start != null && target.isBefore(start)) {
            return false;
        }
        return end == null || !target.isAfter(end);
    }

    private int calculateNormalOrderFee(int totalSalesAmount) {
        return (int) Math.floor(totalSalesAmount * 0.05);
    }

    private record ResellSettlementAmount(
            int totalSalesAmount,
            int platformFee
    ) {
    }
}
