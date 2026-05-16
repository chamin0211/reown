# RE:OWN 리셀 자동 경매 마감 패치

## 추가된 기능

프리미엄 리셀 상품의 `auction_end_at`이 지나면 서버가 자동으로 경매를 마감합니다.

처리 규칙은 아래와 같습니다.

1. `ON_SALE` 상태이고 `auction_end_at <= 현재 시각`인 리셀 상품을 찾습니다.
2. 최고 입찰이 있으면 최고 입찰자를 `ACCEPTED` 처리하고 리셀 상품을 `SOLD` 처리합니다.
3. 최고 입찰자가 있으면 `asset_resell_transaction`에 거래 완료 내역을 생성합니다.
4. 입찰이 없으면 리셀 상품을 `EXPIRED`로 유찰 처리합니다.
5. Redis 경매 상태 캐시를 삭제합니다.
6. `/topic/resells/{resellId}`로 WebSocket 이벤트를 발행합니다.

## 추가/수정 파일

```text
src/main/java/com/reown/ReownApplication.java
src/main/java/com/reown/backend/asset/controller/ResellController.java
src/main/java/com/reown/backend/asset/dto/ResellAuctionCloseResultResponse.java
src/main/java/com/reown/backend/asset/repository/AssetResellMarketRepository.java
src/main/java/com/reown/backend/asset/scheduler/ResellAuctionScheduler.java
src/main/java/com/reown/backend/asset/service/ResellService.java
src/main/resources/application-local.yml
frontend/src/app/pages/ResellDetailPage.tsx
api-test-resell-auto-close.http
```

## 스케줄러 실행 주기

기본값은 서버 시작 10초 뒤부터 실행되고, 이후 60초마다 한 번씩 실행됩니다.

```yml
reown:
  resell:
    auction-close-fixed-delay-ms: 60000
    auction-close-initial-delay-ms: 10000
```

테스트를 빠르게 하고 싶으면 `application-local.yml`에서 `auction-close-fixed-delay-ms`를 `10000`으로 바꿔도 됩니다.

## 테스트 방법

### 1. Redis 실행

```bash
docker start reown-redis
```

실행 확인:

```bash
docker exec -it reown-redis redis-cli ping
```

`PONG`이 나오면 정상입니다.

### 2. Spring Boot 실행

IntelliJ에서 `ReownApplication`을 실행합니다.

### 3. 마감 시간이 가까운 리셀 상품 등록

셀러 리셀 등록 화면에서 입찰 마감일을 1~2분 뒤로 설정합니다.

예시:

```text
입찰 시작가: 120000
즉시 구매가: 350000
최소 입찰 단위: 5000
입찰 마감일: 현재 시각 기준 1~2분 뒤
```

### 4. 관리자 승인

관리자 페이지에서 해당 리셀 상품을 승인합니다.

### 5. 입찰 등록

일반 사용자로 리셀 상세 페이지에 들어가서 한 번 이상 입찰합니다.

예시:

```text
125000원 입찰
```

### 6. 자동 마감 확인

마감 시간이 지나고 스케줄러가 실행되면 아래처럼 바뀝니다.

```text
리셀 상품 상태: SOLD
최고 입찰: ACCEPTED
거래 내역: COMPLETED 생성
```

입찰이 하나도 없는 상태로 마감되면:

```text
리셀 상품 상태: EXPIRED
거래 내역: 생성 안 됨
```

## 수동 테스트 API

스케줄러를 기다리지 않고 바로 마감 대상을 처리하려면 아래 API를 실행하면 됩니다.

```http
POST http://localhost:8080/api/resells/admin/close-expired
```

응답 예시:

```json
[
  {
    "resellId": 3,
    "previousStatus": "ON_SALE",
    "resultStatus": "SOLD",
    "buyerId": 23,
    "finalPrice": 125000,
    "transactionId": 5,
    "message": "마감 시간이 지나 최고 입찰자가 자동 낙찰되었습니다.",
    "processedAt": "2026-05-16T22:40:00"
  }
]
```

처리할 마감 대상이 없으면 빈 배열 `[]`이 반환됩니다.
