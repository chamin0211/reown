package com.reown.backend.asset.scheduler;

import com.reown.backend.asset.dto.ResellAuctionCloseResultResponse;
import com.reown.backend.asset.service.ResellService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 입찰 마감 시간이 지난 프리미엄 리셀 경매를 자동으로 정리합니다.
 *
 * 처리 규칙
 * 1. ON_SALE 상태이고 auction_end_at <= 현재 시각인 리셀 상품을 찾습니다.
 * 2. 최고 입찰이 있으면 SOLD + 거래내역 생성으로 자동 낙찰 처리합니다.
 * 3. 입찰이 없으면 EXPIRED 상태로 유찰 처리합니다.
 * 4. Redis 경매 상태 캐시를 삭제하고 WebSocket 이벤트를 발행합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ResellAuctionScheduler {

    private final ResellService resellService;

    @Scheduled(
            fixedDelayString = "${reown.resell.auction-close-fixed-delay-ms:60000}",
            initialDelayString = "${reown.resell.auction-close-initial-delay-ms:10000}"
    )
    public void closeExpiredAuctions() {
        List<ResellAuctionCloseResultResponse> results = resellService.closeExpiredAuctions();
        if (!results.isEmpty()) {
            log.info("자동 경매 마감 처리 완료: count={}, results={}", results.size(), results);
        }
    }
}
