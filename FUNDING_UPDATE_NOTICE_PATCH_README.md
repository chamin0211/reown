# Funding Update Notice Patch

## 추가 기능

1. 셀러가 펀딩별 공지/제작 업데이트를 등록할 수 있습니다.
   - 공지
   - 제작 업데이트
   - 배송 업데이트

2. 사용자 펀딩 상세 페이지에서 공지/제작 업데이트를 확인할 수 있습니다.

3. 사용자 내 펀딩 참여 내역에서도 최근 공지/제작 업데이트가 표시됩니다.

## 적용 순서

1. zip 안의 `reown` 폴더를 기존 프로젝트에 덮어쓰기
2. MySQL Workbench에서 `sql/funding_update_notice_schema.sql` 실행
3. 백엔드 ReownApplication 재실행
4. 프론트 재실행

```bash
cd frontend
npm run dev -- --force
```

## 테스트 순서

1. 셀러로 로그인 후 `/seller/funding` 이동
2. 펀딩 목록에서 `공지/업데이트` 버튼 클릭
3. 제목/내용 입력 후 업데이트 등록
4. 일반 사용자로 `/funding/{campaignId}` 또는 `/my/funding` 이동
5. 등록한 공지/업데이트가 보이는지 확인

## 커밋 메시지 추천

```text
feat: add funding update notices
```
