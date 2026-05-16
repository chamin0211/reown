package com.reown.backend.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

/**
 * 프리미엄 입찰형 리셀 등록 요청.
 *
 * RE:OWN의 리셀은 일반 구매상품을 다시 판매하는 중고거래가 아니라,
 * 셀러가 새 프리미엄 아카이브 상품을 등록하고, 관리자가 검수 승인한 뒤
 * 입찰 경쟁으로 거래하는 구조입니다. 화면에서는 productId/optionId를 직접 입력하지 않고,
 * 상품명/이미지/옵션을 받아 서버가 catalog_product, catalog_product_option,
 * asset_resell_market을 한 번에 생성합니다.
 */
public record ResellCreateRequest(
        /** 리셀 상품을 등록한 셀러 user_id입니다. */
        Long sellerId,

        /** catalog_product.brand_id 저장용. 입력하지 않으면 테스트 셀러 브랜드 11을 기본값으로 사용합니다. */
        Long brandId,

        /** 신규 프리미엄 리셀 상품 정보 */
        String productName,
        String thumbnailUrl,
        String categoryName,
        String size,
        String color,
        String colorHex,

        @NotNull
        @Positive
        Integer startPrice,

        @NotNull
        @Positive
        Integer instantBuyPrice,

        @Positive
        Integer minBidIncrement,

        @NotNull
        LocalDateTime auctionEndAt,

        String rarityGrade,
        String conditionDescription,
        String verificationNote,
        String premiumReason,

        /** 구버전 ID 기반 등록 호환용. 신규 화면에서는 사용하지 않습니다. */
        Long productId,
        Long optionId,

        /** 구버전 구매기반 리셀 호환용. 신규 입찰형 리셀에서는 사용하지 않습니다. */
        Long orderItemId,

        /** 구버전 필드 호환용. 신규 입찰형 리셀에서는 instantBuyPrice를 사용합니다. */
        Integer resellPrice
) {
}
