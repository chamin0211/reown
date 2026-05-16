package com.reown.backend.trade.dto;

import com.reown.backend.trade.entity.TradeFundingCampaign;
import com.reown.backend.trade.entity.TradeFundingUpdate;

import java.time.LocalDateTime;

public record FundingUpdateResponse(
        Long updateId,
        Long campaignId,
        Long writerId,
        String updateType,
        String updateTypeLabel,
        String title,
        String content,
        String productionStage,
        String productionStageLabel,
        LocalDateTime createdAt
) {
    public static FundingUpdateResponse from(TradeFundingUpdate update) {
        return new FundingUpdateResponse(
                update.getUpdateId(),
                update.getCampaignId(),
                update.getWriterId(),
                update.getUpdateType(),
                updateTypeLabel(update.getUpdateType()),
                update.getTitle(),
                update.getContent(),
                update.getProductionStage(),
                productionStageLabel(update.getProductionStage()),
                update.getCreatedAt()
        );
    }

    private static String updateTypeLabel(String type) {
        return switch (type) {
            case TradeFundingUpdate.TYPE_PRODUCTION -> "제작 업데이트";
            case TradeFundingUpdate.TYPE_SHIPPING -> "배송 업데이트";
            default -> "공지";
        };
    }

    private static String productionStageLabel(String stage) {
        if (stage == null || stage.isBlank()) {
            return null;
        }

        return switch (stage) {
            case TradeFundingCampaign.STAGE_PRODUCTION_READY -> "제작 준비";
            case TradeFundingCampaign.STAGE_IN_PRODUCTION -> "제작 중";
            case TradeFundingCampaign.STAGE_SHIPPING_PREP -> "배송 준비";
            case TradeFundingCampaign.STAGE_SHIPPED -> "배송 완료";
            default -> stage;
        };
    }
}
