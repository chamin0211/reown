-- DB 관련 설명
-- 이 SQL은 펀딩 기능을 옵션/수량 기반으로 구체화할 때 필요한 컬럼을 추가합니다.
-- application-local.yml에서 spring.jpa.hibernate.ddl-auto=update를 사용 중이면 보통 자동으로 추가됩니다.
-- 자동 추가가 안 되거나 Workbench에서 직접 확인하고 싶을 때만 실행하세요.
--
-- 추가 대상 테이블: trade_funding_participation
-- option_id  : catalog_product_option.option_id, 사용자가 선택한 옵션입니다.
-- quantity   : 사용자가 선택한 펀딩 참여 수량입니다.
-- unit_price : 참여 당시 상품 단가입니다. amount = unit_price * quantity 구조로 저장됩니다.

USE reown_db;

ALTER TABLE trade_funding_participation
    ADD COLUMN option_id BIGINT NULL;

ALTER TABLE trade_funding_participation
    ADD COLUMN quantity INT NULL;

ALTER TABLE trade_funding_participation
    ADD COLUMN unit_price INT NULL;
