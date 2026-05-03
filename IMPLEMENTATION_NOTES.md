# RE:OWN 구현 방향 정리

## 현재 구현 범위

- DB 기반 회원가입/로그인
- USER / SELLER / ADMIN 역할 구분
- 브랜드 입점 신청
- 관리자 브랜드 승인/반려
- 브랜드 승인 시 사용자 역할 SELLER 전환
- 상품 등록 기본 상태 WAITING
- 관리자 상품 승인 시 ON_SALE 전환
- 사용자 상품 목록은 ON_SALE 상품만 노출
- 장바구니 / 주문 / Mock 결제 / 펀딩 / 리셀 기본 API 유지

## 이번 범위에서 제외한 것

- Spring Security JWT 인증 고도화
- 카카오 로그인 실제 OAuth2 연동
- PortOne 실제 결제 검증
- Redis 기반 KREAM식 실시간 입찰
- 디지털 보증서

## 나중에 붙일 확장 위치

- 카카오 로그인: `com.reown.backend.integration.kakao`
- PortOne 결제: `com.reown.backend.integration.portone`
- Redis 입찰: `com.reown.backend.integration.redisbid`

현재는 `/api/auth/signup`, `/api/auth/login` 응답의 `userId`, `role`을 프론트에서 저장한 뒤 화면과 API 흐름을 연결하는 방식입니다.
