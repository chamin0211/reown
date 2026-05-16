package com.reown.backend.trade.dto;

public record FundingUpdateCreateRequest(
        String updateType,
        String title,
        String content,
        String productionStage
) {
}
