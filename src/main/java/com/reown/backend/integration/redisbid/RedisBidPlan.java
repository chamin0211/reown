package com.reown.backend.integration.redisbid;

/**
 * Redis 기반 KREAM식 입찰은 나중에 추가할 기술 포인트입니다.
 * 현재 리셀은 DB 기반 등록/제안/구매 흐름을 사용합니다.
 */
public final class RedisBidPlan {

    private RedisBidPlan() {
    }

    public static final String BUY_ORDER_KEY_PREFIX = "resell:buy:";
    public static final String SELL_ORDER_KEY_PREFIX = "resell:sell:";
    public static final String MATCHING_RULE = "최고 구매 희망가 >= 최저 판매 희망가이면 거래 체결";
}
