USE reown_db;

-- 결제 연동 없이 펀딩 성공 후 제작/배송 진행 단계를 관리하기 위한 컬럼입니다.
-- 이미 컬럼이 있으면 이 ALTER 문은 오류가 날 수 있습니다. 그 경우 아래 UPDATE 문만 실행하면 됩니다.
ALTER TABLE trade_funding_campaign
ADD COLUMN production_stage VARCHAR(50) NULL DEFAULT 'NOT_STARTED' AFTER funding_status;

-- 기존 성공 펀딩은 제작 준비 상태로 시작하도록 보정합니다.
UPDATE trade_funding_campaign
SET production_stage = 'PRODUCTION_READY'
WHERE funding_status = 'SUCCESS'
  AND (production_stage IS NULL OR production_stage = '' OR production_stage = 'NOT_STARTED');

-- 성공 전/실패/취소/반려 펀딩은 제작 전 상태로 정리합니다.
UPDATE trade_funding_campaign
SET production_stage = 'NOT_STARTED'
WHERE funding_status <> 'SUCCESS'
  AND (production_stage IS NULL OR production_stage = '');

SELECT campaign_id, product_id, funding_status, production_stage, target_amount, current_amount
FROM trade_funding_campaign
ORDER BY campaign_id DESC;
