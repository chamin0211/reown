USE reown_db;

-- 프리미엄 입찰형 리셀 구조 확장
-- 이미 존재하는 컬럼은 Workbench에서 duplicate column 에러가 날 수 있으니, 한 번만 실행하면 됩니다.

ALTER TABLE asset_resell_market
    MODIFY COLUMN order_item_id BIGINT NULL;

ALTER TABLE asset_resell_market
    ADD COLUMN start_price INT NULL AFTER condition_description,
    ADD COLUMN current_highest_bid INT NULL AFTER start_price,
    ADD COLUMN current_highest_bidder_id BIGINT NULL AFTER current_highest_bid,
    ADD COLUMN min_bid_increment INT NULL AFTER current_highest_bidder_id,
    ADD COLUMN bid_count INT NULL AFTER min_bid_increment,
    ADD COLUMN auction_end_at DATETIME NULL AFTER bid_count,
    ADD COLUMN rarity_grade VARCHAR(50) NULL AFTER auction_end_at,
    ADD COLUMN verification_note TEXT NULL AFTER rarity_grade,
    ADD COLUMN premium_reason TEXT NULL AFTER verification_note;

UPDATE asset_resell_market
SET
    start_price = COALESCE(start_price, resell_price),
    current_highest_bid = COALESCE(current_highest_bid, 0),
    min_bid_increment = COALESCE(min_bid_increment, 1000),
    bid_count = COALESCE(bid_count, 0),
    auction_end_at = COALESCE(auction_end_at, DATE_ADD(NOW(), INTERVAL 7 DAY)),
    rarity_grade = COALESCE(rarity_grade, 'ARCHIVE'),
    verification_note = COALESCE(verification_note, '관리자 검수 완료'),
    premium_reason = COALESCE(premium_reason, '프리미엄 리셀 전환 데이터')
WHERE resell_id IS NOT NULL;

-- 기존 PENDING 가격 제안은 입찰형 구조에서 LEADING/OUTBID로 바뀝니다.
UPDATE asset_resell_price_offer
SET status = 'OUTBID'
WHERE status = 'PENDING';
