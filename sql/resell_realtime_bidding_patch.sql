-- RE:OWN 리셀 실시간 입찰 안정화용 인덱스
-- MySQL 8 기준입니다. 이미 같은 이름의 인덱스가 있으면 중복 생성 오류가 날 수 있으니 한 번만 실행하세요.

USE reown_db;

CREATE INDEX idx_resell_market_status_end_at
ON asset_resell_market(status, auction_end_at);

CREATE INDEX idx_resell_market_seller_status_created
ON asset_resell_market(seller_id, status, created_at);

CREATE INDEX idx_resell_offer_resell_price
ON asset_resell_price_offer(resell_id, offer_price);

CREATE INDEX idx_resell_offer_resell_created
ON asset_resell_price_offer(resell_id, created_at);

CREATE INDEX idx_resell_offer_buyer_created
ON asset_resell_price_offer(buyer_id, created_at);
