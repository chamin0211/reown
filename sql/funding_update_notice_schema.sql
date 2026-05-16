USE reown_db;

-- 펀딩 공지/제작 업데이트 저장 테이블입니다.
-- 셀러가 성공 펀딩의 제작 진행 상황 또는 일반 안내를 등록하면 이 테이블에 저장됩니다.
CREATE TABLE IF NOT EXISTS trade_funding_update (
    update_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    writer_id BIGINT NULL,
    update_type VARCHAR(50) NULL DEFAULT 'NOTICE',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    production_stage VARCHAR(50) NULL,
    created_at DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_trade_funding_update_campaign_id (campaign_id),
    INDEX idx_trade_funding_update_created_at (created_at)
);

-- 확인용
SELECT update_id, campaign_id, writer_id, update_type, title, production_stage, created_at
FROM trade_funding_update
ORDER BY update_id DESC;
