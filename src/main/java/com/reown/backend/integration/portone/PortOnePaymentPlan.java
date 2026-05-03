package com.reown.backend.integration.portone;

/**
 * 실제 결제 연동은 현재 구현 범위에서 제외합니다.
 * 현재는 /api/payments/mock 으로 주문 결제 완료 흐름만 검증하고,
 * 나중에 PortOne 결제 검증 API를 이 위치에 추가하면 됩니다.
 */
public final class PortOnePaymentPlan {

    private PortOnePaymentPlan() {
    }

    public static final String PAYMENT_VERIFY_STEP = "프론트 결제 완료 -> imp_uid 전달 -> 서버에서 PortOne 결제 검증 -> 주문 상태 PAID 변경";
}
