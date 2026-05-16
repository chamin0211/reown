/*
DB 관련 설명
- 매핑 테이블: trade_funding_campaign
- 펀딩 생명주기 상태는 funding_status 컬럼으로 관리합니다.
  WAITING  : 셀러 등록 후 관리자 승인 대기
  OPEN     : 관리자 승인 후 사용자 참여 가능
  SUCCESS  : 목표 금액 달성
  FAILED   : 종료일이 지났고 목표 금액 미달
  REJECTED : 관리자 반려
  CANCELED : 관리자/시스템 취소
- production_stage 컬럼은 결제 연동 없이 펀딩 성공 후 제작/배송 진행 단계를 표시하기 위한 상태값입니다.
  NOT_STARTED      : 아직 제작 전 또는 펀딩 진행 전
  PRODUCTION_READY : 펀딩 성공 후 제작 준비
  IN_PRODUCTION    : 제작 중
  SHIPPING_PREP    : 배송 준비
  SHIPPED          : 배송 완료
- current_amount는 취소되지 않은 trade_funding_participation.amount 합계와 같은 의미로 관리합니다.
*/
package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "trade_funding_campaign")
@Getter
@NoArgsConstructor
public class TradeFundingCampaign {

    public static final String STATUS_WAITING = "WAITING";
    public static final String STATUS_OPEN = "OPEN";
    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_REJECTED = "REJECTED";
    public static final String STATUS_CANCELED = "CANCELED";

    public static final String STAGE_NOT_STARTED = "NOT_STARTED";
    public static final String STAGE_PRODUCTION_READY = "PRODUCTION_READY";
    public static final String STAGE_IN_PRODUCTION = "IN_PRODUCTION";
    public static final String STAGE_SHIPPING_PREP = "SHIPPING_PREP";
    public static final String STAGE_SHIPPED = "SHIPPED";

    private static final Set<String> ALLOWED_PRODUCTION_STAGES = Set.of(
            STAGE_NOT_STARTED,
            STAGE_PRODUCTION_READY,
            STAGE_IN_PRODUCTION,
            STAGE_SHIPPING_PREP,
            STAGE_SHIPPED
    );

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "target_amount", nullable = false)
    private Integer targetAmount;

    @Column(name = "current_amount", nullable = false)
    private Integer currentAmount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "funding_status")
    private String fundingStatus;

    @Column(name = "production_stage")
    private String productionStage;

    public TradeFundingCampaign(
            Long productId,
            Integer targetAmount,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String fundingStatus
    ) {
        this.productId = productId;
        this.targetAmount = targetAmount != null && targetAmount > 0 ? targetAmount : 1;
        this.currentAmount = 0;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fundingStatus = fundingStatus != null ? fundingStatus : STATUS_WAITING;
        this.productionStage = STAGE_NOT_STARTED;
    }

    public void approve(LocalDateTime now) {
        refreshLifecycleStatus(now);

        if (STATUS_REJECTED.equals(this.fundingStatus) || STATUS_CANCELED.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("반려/취소된 펀딩은 바로 승인할 수 없습니다. 다시 등록해주세요.");
        }

        if (isAfterEndDate(now) && !isTargetReached()) {
            this.fundingStatus = STATUS_FAILED;
            throw new IllegalArgumentException("종료일이 지난 펀딩은 승인할 수 없습니다.");
        }

        this.fundingStatus = isTargetReached() ? STATUS_SUCCESS : STATUS_OPEN;
        ensureProductionStageForSuccess();
    }

    public void approve() {
        approve(LocalDateTime.now());
    }

    public void reject() {
        if (STATUS_SUCCESS.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("이미 성공한 펀딩은 반려할 수 없습니다.");
        }
        this.fundingStatus = STATUS_REJECTED;
    }

    public void participate(Integer amount, LocalDateTime now) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("펀딩 참여 금액은 1원 이상이어야 합니다.");
        }

        refreshLifecycleStatus(now);
        validateCanParticipate(now);

        this.currentAmount = Math.max(0, this.currentAmount) + amount;

        if (isTargetReached()) {
            this.fundingStatus = STATUS_SUCCESS;
            ensureProductionStageForSuccess();
        }
    }

    public void cancelParticipation(Integer amount, LocalDateTime now) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("취소 금액은 1원 이상이어야 합니다.");
        }

        refreshLifecycleStatus(now);
        validateCanCancelParticipation(now);

        this.currentAmount = Math.max(0, Math.max(0, this.currentAmount) - amount);
    }

    public void cancel() {
        if (STATUS_SUCCESS.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("이미 성공한 펀딩은 취소할 수 없습니다.");
        }
        this.fundingStatus = STATUS_CANCELED;
    }

    public void refreshLifecycleStatus(LocalDateTime now) {
        if (!STATUS_OPEN.equals(this.fundingStatus)) {
            if (STATUS_SUCCESS.equals(this.fundingStatus)) {
                ensureProductionStageForSuccess();
            }
            return;
        }

        if (isTargetReached()) {
            this.fundingStatus = STATUS_SUCCESS;
            ensureProductionStageForSuccess();
            return;
        }

        if (isAfterEndDate(now)) {
            this.fundingStatus = STATUS_FAILED;
        }
    }

    public boolean isOpenForParticipation(LocalDateTime now) {
        refreshLifecycleStatus(now);
        return STATUS_OPEN.equals(this.fundingStatus)
                && !isBeforeStartDate(now)
                && !isAfterEndDate(now);
    }

    public void updateProductionStage(String nextStage) {
        if (!STATUS_SUCCESS.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("펀딩 성공 후에만 제작 단계를 변경할 수 있습니다. fundingStatus=" + this.fundingStatus);
        }

        String normalizedStage = normalizeProductionStage(nextStage);
        if (STAGE_NOT_STARTED.equals(normalizedStage)) {
            throw new IllegalArgumentException("성공한 펀딩은 제작 전 상태로 되돌릴 수 없습니다.");
        }

        this.productionStage = normalizedStage;
    }

    public String getProductionStageValue() {
        if (this.productionStage == null || this.productionStage.isBlank()) {
            return STATUS_SUCCESS.equals(this.fundingStatus) ? STAGE_PRODUCTION_READY : STAGE_NOT_STARTED;
        }
        return this.productionStage;
    }

    private void validateCanParticipate(LocalDateTime now) {
        if (!STATUS_OPEN.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("참여 가능한 펀딩이 아닙니다. status=" + this.fundingStatus);
        }

        if (isBeforeStartDate(now)) {
            throw new IllegalArgumentException("아직 시작 전인 펀딩입니다.");
        }

        if (isAfterEndDate(now)) {
            this.fundingStatus = isTargetReached() ? STATUS_SUCCESS : STATUS_FAILED;
            ensureProductionStageForSuccess();
            throw new IllegalArgumentException("이미 종료된 펀딩입니다.");
        }
    }

    private void validateCanCancelParticipation(LocalDateTime now) {
        if (!STATUS_OPEN.equals(this.fundingStatus)) {
            throw new IllegalArgumentException("진행 중인 펀딩만 참여 취소가 가능합니다. status=" + this.fundingStatus);
        }

        if (isAfterEndDate(now)) {
            this.fundingStatus = isTargetReached() ? STATUS_SUCCESS : STATUS_FAILED;
            ensureProductionStageForSuccess();
            throw new IllegalArgumentException("종료된 펀딩은 참여 취소가 불가능합니다.");
        }
    }

    private void ensureProductionStageForSuccess() {
        if (!STATUS_SUCCESS.equals(this.fundingStatus)) {
            return;
        }

        if (this.productionStage == null
                || this.productionStage.isBlank()
                || STAGE_NOT_STARTED.equals(this.productionStage)) {
            this.productionStage = STAGE_PRODUCTION_READY;
        }
    }

    private String normalizeProductionStage(String stage) {
        if (stage == null || stage.isBlank()) {
            throw new IllegalArgumentException("변경할 제작 단계를 입력해주세요.");
        }

        String normalized = stage.trim().toUpperCase();
        if (!ALLOWED_PRODUCTION_STAGES.contains(normalized)) {
            throw new IllegalArgumentException("지원하지 않는 제작 단계입니다. productionStage=" + stage);
        }

        return normalized;
    }

    private boolean isTargetReached() {
        return this.currentAmount != null
                && this.targetAmount != null
                && this.currentAmount >= this.targetAmount;
    }

    private boolean isBeforeStartDate(LocalDateTime now) {
        return this.startDate != null && now.isBefore(this.startDate);
    }

    private boolean isAfterEndDate(LocalDateTime now) {
        return this.endDate != null && now.isAfter(this.endDate);
    }
}
