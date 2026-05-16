package com.reown.backend.asset.service;

import com.reown.backend.asset.entity.AssetResellMarket;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * 리셀 실시간 입찰용 Redis 보조 서비스입니다.
 *
 * DB(MySQL)는 최종 정본 데이터로 유지하고,
 * Redis는 1) 같은 상품에 대한 동시 입찰 잠금, 2) 현재 경매 상태 캐시에 사용합니다.
 */
@Service
@RequiredArgsConstructor
public class ResellBidRedisService {

    private static final Duration LOCK_TTL = Duration.ofSeconds(5);
    private static final Duration DEFAULT_STATE_TTL = Duration.ofDays(7);

    private final StringRedisTemplate redisTemplate;

    public <T> T executeWithAuctionLock(Long resellId, Supplier<T> supplier) {
        String lockKey = lockKey(resellId);
        String token = UUID.randomUUID().toString();

        Boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, token, LOCK_TTL);
        if (!Boolean.TRUE.equals(locked)) {
            throw new IllegalStateException("다른 사용자의 입찰을 처리 중입니다. 잠시 후 다시 시도해주세요.");
        }

        try {
            return supplier.get();
        } finally {
            releaseLock(lockKey, token);
        }
    }

    public void cacheAuctionState(AssetResellMarket resell) {
        if (resell == null || resell.getResellId() == null) return;

        String key = stateKey(resell.getResellId());
        redisTemplate.opsForHash().putAll(key, Map.of(
                "resellId", String.valueOf(resell.getResellId()),
                "status", safe(resell.getStatus()),
                "sellerId", safe(resell.getSellerId()),
                "startPrice", safe(resell.getStartPrice()),
                "instantBuyPrice", safe(resell.getResellPrice()),
                "currentHighestBid", safe(resell.getCurrentHighestBid()),
                "currentHighestBidderId", safe(resell.getCurrentHighestBidderId()),
                "minBidIncrement", safe(resell.getMinBidIncrement()),
                "bidCount", safe(resell.getBidCount()),
                "auctionEndAt", safe(resell.getAuctionEndAt())
        ));

        redisTemplate.expire(key, calculateStateTtl(resell.getAuctionEndAt()));
    }

    public void deleteAuctionState(Long resellId) {
        if (resellId == null) return;
        redisTemplate.delete(stateKey(resellId));
    }

    private void releaseLock(String lockKey, String token) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] " +
                "then return redis.call('del', KEYS[1]) else return 0 end";
        redisTemplate.execute(new DefaultRedisScript<>(script, Long.class), List.of(lockKey), token);
    }

    private Duration calculateStateTtl(LocalDateTime auctionEndAt) {
        if (auctionEndAt == null) return DEFAULT_STATE_TTL;
        long seconds = ChronoUnit.SECONDS.between(LocalDateTime.now(), auctionEndAt.plusDays(1));
        return seconds > 0 ? Duration.ofSeconds(seconds) : Duration.ofDays(1);
    }

    private String lockKey(Long resellId) {
        return "lock:resell:auction:" + resellId;
    }

    private String stateKey(Long resellId) {
        return "resell:auction:" + resellId + ":state";
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
