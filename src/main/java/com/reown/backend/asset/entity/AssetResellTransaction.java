package com.reown.backend.asset.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_resell_transaction")
@Getter
@NoArgsConstructor
public class AssetResellTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "resell_id", nullable = false)
    private Long resellId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "resell_price", nullable = false)
    private Integer resellPrice;

    @Column(name = "platform_fee")
    private Integer platformFee;

    /**
     * PAYMENT_WAITING: 낙찰/즉시구매 직후 결제 대기
     * PAID: 결제 완료
     * PREPARING_SHIPMENT: 판매자 배송 준비
     * SHIPPING: 배송 중
     * PURCHASE_CONFIRMED: 구매 확정
     * SETTLED: 정산 완료
     * CANCELED: 거래 취소
     * COMPLETED: 구버전 호환 상태
     */
    @Column(name = "status")
    private String status;

    @Column(name = "courier_name")
    private String courierName;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "settlement_amount")
    private Integer settlementAmount;

    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "shipment_prepared_at")
    private LocalDateTime shipmentPreparedAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "purchase_confirmed_at")
    private LocalDateTime purchaseConfirmedAt;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    public AssetResellTransaction(Long resellId, Long buyerId, Integer resellPrice, Integer platformFee) {
        this.resellId = resellId;
        this.buyerId = buyerId;
        this.resellPrice = resellPrice;
        this.platformFee = platformFee;
        this.status = "PAYMENT_WAITING";
        this.settlementAmount = calculateSettlementAmount(resellPrice, platformFee);
        this.createdAt = LocalDateTime.now();
    }

    public void markPaid(Long buyerId) {
        validateBuyer(buyerId);
        if (!"PAYMENT_WAITING".equals(this.status)) {
            throw new IllegalArgumentException("결제 대기 상태의 리셀 거래만 결제 완료 처리할 수 있습니다.");
        }
        this.status = "PAID";
        this.paidAt = LocalDateTime.now();
    }

    public void markPreparingShipment() {
        if (!"PAID".equals(this.status)) {
            throw new IllegalArgumentException("결제 완료된 리셀 거래만 배송 준비 처리할 수 있습니다.");
        }
        this.status = "PREPARING_SHIPMENT";
        this.shipmentPreparedAt = LocalDateTime.now();
    }

    public void markShipping(String courierName, String trackingNumber) {
        if (!"PAID".equals(this.status) && !"PREPARING_SHIPMENT".equals(this.status)) {
            throw new IllegalArgumentException("결제 완료 또는 배송 준비 상태의 리셀 거래만 배송 중 처리할 수 있습니다.");
        }
        this.status = "SHIPPING";
        this.courierName = blankToNull(courierName);
        this.trackingNumber = blankToNull(trackingNumber);
        this.shippedAt = LocalDateTime.now();
    }

    public void confirmPurchase(Long buyerId) {
        validateBuyer(buyerId);
        if (!"SHIPPING".equals(this.status)) {
            throw new IllegalArgumentException("배송 중인 리셀 거래만 구매 확정할 수 있습니다.");
        }
        this.status = "PURCHASE_CONFIRMED";
        this.purchaseConfirmedAt = LocalDateTime.now();
    }

    public void settle() {
        if (!"PURCHASE_CONFIRMED".equals(this.status) && !"COMPLETED".equals(this.status)) {
            throw new IllegalArgumentException("구매 확정된 리셀 거래만 정산 완료 처리할 수 있습니다.");
        }
        this.status = "SETTLED";
        this.settlementAmount = calculateSettlementAmount(this.resellPrice, this.platformFee);
        this.settledAt = LocalDateTime.now();
    }

    public void cancel(String reason) {
        if ("SETTLED".equals(this.status)) {
            throw new IllegalArgumentException("이미 정산 완료된 리셀 거래는 취소할 수 없습니다.");
        }
        this.status = "CANCELED";
        this.cancelReason = blankToNull(reason);
        this.canceledAt = LocalDateTime.now();
    }

    private void validateBuyer(Long buyerId) {
        if (buyerId != null && this.buyerId != null && !this.buyerId.equals(buyerId)) {
            throw new IllegalArgumentException("해당 거래의 구매자만 처리할 수 있습니다.");
        }
    }

    private Integer calculateSettlementAmount(Integer price, Integer fee) {
        int safePrice = price == null ? 0 : price;
        int safeFee = fee == null ? 0 : fee;
        return Math.max(safePrice - safeFee, 0);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
