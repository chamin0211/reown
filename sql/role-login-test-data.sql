USE reown_db;

-- 현재 프로젝트는 테스트용으로 비밀번호를 평문 저장하는 구조입니다.
-- 로그인 테스트 계정
-- 관리자: admin@test.com / 1234
-- 셀러: seller@test.com / 1234
-- 일반 사용자: user@test.com / 1234

INSERT INTO user_member (email, password, nickname, role, created_at)
SELECT 'admin@test.com', '1234', '관리자', 'ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_member WHERE email = 'admin@test.com');

INSERT INTO user_member (email, password, nickname, role, created_at)
SELECT 'seller@test.com', '1234', '테스트 셀러', 'SELLER', NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_member WHERE email = 'seller@test.com');

INSERT INTO user_member (email, password, nickname, role, created_at)
SELECT 'user@test.com', '1234', '일반 사용자', 'USER', NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_member WHERE email = 'user@test.com');

SET @seller_user_id := (SELECT user_id FROM user_member WHERE email = 'seller@test.com' LIMIT 1);

INSERT INTO partner_brand (
    owner_user_id,
    brand_name,
    brand_logo_url,
    business_number,
    sales_status,
    settlement_cycle,
    status,
    created_at
)
SELECT
    @seller_user_id,
    '테스트 셀러 브랜드',
    NULL,
    '000-00-00000',
    'ACTIVE',
    'MONTHLY',
    'APPROVED',
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM partner_brand
    WHERE owner_user_id = @seller_user_id
      AND status = 'APPROVED'
);

SELECT user_id, email, nickname, role, created_at
FROM user_member
WHERE email IN ('admin@test.com', 'seller@test.com', 'user@test.com')
ORDER BY user_id;

SELECT brand_id, owner_user_id, brand_name, status, sales_status
FROM partner_brand
WHERE owner_user_id = @seller_user_id
ORDER BY brand_id;
