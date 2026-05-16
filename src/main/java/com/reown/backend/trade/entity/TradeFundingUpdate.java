/*
DB 관련 설명
- 매핑 테이블: trade_funding_update
- 펀딩 성공 후 제작/배송 진행 상황이나 일반 공지를 셀러가 등록하는 테이블입니다.
- campaign_id로 trade_funding_campaign과 연결되며, writer_id에는 현재는 brand_id를 저장합니다.
- 실제 알림/결제 연동 전 단계에서는 공지성 업데이트만 저장하고 사용자 화면에서 조회합니다.
*/
package com.reown.backend.trade.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trade_funding_update")
@Getter
@NoArgsConstructor
public class TradeFundingUpdate {

    public static final String TYPE_NOTICE = "NOTICE";
    public static final String TYPE_PRODUCTION = "PRODUCTION";
    public static final String TYPE_SHIPPING = "SHIPPING";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "update_id")
    private Long updateId;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "writer_id")
    private Long writerId;

    @Column(name = "update_type")
    private String updateType;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "production_stage")
    private String productionStage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public TradeFundingUpdate(
            Long campaignId,
            Long writerId,
            String updateType,
            String title,
            String content,
            String productionStage
    ) {
        this.campaignId = campaignId;
        this.writerId = writerId;
        this.updateType = normalizeUpdateType(updateType);
        this.title = normalizeRequiredText(title, "공지 제목을 입력해주세요.");
        this.content = normalizeRequiredText(content, "공지 내용을 입력해주세요.");
        this.productionStage = normalizeBlankToNull(productionStage);
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updateType == null || this.updateType.isBlank()) {
            this.updateType = TYPE_NOTICE;
        }
    }

    private String normalizeUpdateType(String value) {
        if (value == null || value.isBlank()) {
            return TYPE_NOTICE;
        }

        String normalized = value.trim().toUpperCase();
        return switch (normalized) {
            case TYPE_PRODUCTION, TYPE_SHIPPING -> normalized;
            default -> TYPE_NOTICE;
        };
    }

    private String normalizeRequiredText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String normalizeBlankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
