package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ResellUpdateRequest(
        @NotNull(message = "판매자 ID는 필수입니다.")
        Long sellerId,

        @NotNull(message = "리셀 가격은 필수입니다.")
        @Positive(message = "리셀 가격은 0보다 커야 합니다.")
        Integer resellPrice,

        @NotBlank(message = "상품 상태 설명은 필수입니다.")
        String conditionDescription
) {
}
