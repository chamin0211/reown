# RE:OWN 리셀 Redis 실시간 입찰 1차 패치

이번 패치는 기존 DB 기반 프리미엄 입찰형 리셀에 Redis와 WebSocket을 붙인 1차 버전입니다.

## 추가/수정된 핵심 내용

### 1. Redis Lock 기반 동시 입찰 방지

수정/추가 파일:

- `src/main/java/com/reown/backend/asset/service/ResellBidRedisService.java`
- `src/main/java/com/reown/backend/asset/service/ResellService.java`
- `src/main/java/com/reown/backend/asset/repository/AssetResellMarketRepository.java`

입찰 요청이 들어오면 다음 순서로 처리합니다.

1. `lock:resell:auction:{resellId}` Redis Lock 획득
2. `asset_resell_market` row에 DB 비관적 락 적용
3. 현재 최고가 기준으로 최소 입찰가 검증
4. 기존 최고 입찰은 `OUTBID` 처리
5. 새 입찰은 `LEADING` 저장
6. `asset_resell_market.current_highest_bid` 갱신
7. Redis 경매 상태 캐시 갱신
8. WebSocket 이벤트 발행

### 2. Redis 경매 상태 캐시

Redis Hash key:

```text
resell:auction:{resellId}:state
```

저장 값:

```text
status
sellerId
startPrice
instantBuyPrice
currentHighestBid
currentHighestBidderId
minBidIncrement
bidCount
auctionEndAt
```

DB가 최종 정본이고 Redis는 실시간 상태 캐시입니다.

### 3. WebSocket 실시간 입찰 이벤트

추가 파일:

- `src/main/java/com/reown/backend/global/config/WebSocketConfig.java`
- `src/main/java/com/reown/backend/asset/dto/ResellBidEventResponse.java`

프론트 구독 경로:

```text
/topic/resells/{resellId}
```

WebSocket 연결 엔드포인트:

```text
ws://localhost:8080/ws
```

### 4. 프론트 리셀 상세 페이지 실시간 반영

추가/수정 파일:

- `frontend/src/app/api/resellRealtime.ts`
- `frontend/src/app/pages/ResellDetailPage.tsx`

리셀 상세 페이지에 들어가면 WebSocket을 구독하고, 다른 사용자가 입찰하면 현재 최고가/입찰 수/입찰 내역이 자동 갱신됩니다.

## 실행 전 필요한 것

### Redis 실행

로컬 PC에 Redis가 켜져 있어야 입찰 등록이 정상 동작합니다.

Docker 사용 시 예시:

```bash
docker run --name reown-redis -p 6379:6379 -d redis:7
```

이미 같은 이름의 컨테이너가 있으면 다음처럼 실행하세요.

```bash
docker start reown-redis
```

### application-local.yml 설정

추가된 설정:

```yml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
```

## DB 인덱스 추가

선택 실행 파일:

```text
sql/resell_realtime_bidding_patch.sql
```

MySQL Workbench에서 한 번만 실행하면 됩니다.

## 테스트 순서

1. MySQL 실행
2. Redis 실행
3. Spring Boot 실행
4. React 실행
5. 관리자 페이지에서 리셀 상품 승인
6. 서로 다른 브라우저 또는 시크릿 창으로 같은 리셀 상세 페이지 접속
7. 한쪽에서 입찰
8. 다른 쪽 화면의 현재 최고가/입찰 수가 자동 갱신되는지 확인

## 다음에 이어서 개발하면 좋은 것

1. `@Scheduled` 기반 자동 경매 마감
2. Redis Sorted Set 기반 입찰 랭킹 캐시
3. 입찰 마감 1분 전 자동 연장 기능
4. 결제/예치금 검증 후 입찰 허용
5. 관리자 실시간 모니터링 페이지
