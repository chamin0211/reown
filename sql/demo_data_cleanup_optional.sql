USE reown_db;

-- 발표 전 더미 데이터 확인용 SQL입니다.
-- 바로 삭제하지 말고 먼저 SELECT 결과를 보고, 숨길 데이터만 결정하세요.

-- 1. 더미 셀러/브랜드 후보 확인
SELECT 
    b.brand_id,
    b.brand_name,
    b.status,
    b.sales_status,
    u.user_id,
    u.login_id,
    u.email,
    u.role
FROM partner_brand b
JOIN user_member u ON u.user_id = b.owner_user_id
WHERE u.email REGEXP '^seller[0-9]+@.*\\.test$'
   OR u.login_id REGEXP '^seller[0-9]+$'
ORDER BY b.brand_id;

-- 2. 발표용 계정 확인
SELECT user_id, login_id, email, nickname, role
FROM user_member
WHERE role IN ('USER', 'SELLER', 'DESIGNER', 'ADMIN', 'MASTER')
ORDER BY user_id;

-- 3. 상품 노출 상태 확인
SELECT 
    p.product_id,
    p.product_name,
    p.sale_type,
    p.approval_status,
    p.sale_status,
    b.brand_name,
    u.login_id
FROM catalog_product p
LEFT JOIN partner_brand b ON b.brand_id = p.brand_id
LEFT JOIN user_member u ON u.user_id = b.owner_user_id
ORDER BY p.product_id DESC;

-- 아래 UPDATE는 필요한 경우에만 직접 주석을 해제해서 사용하세요.
-- 데이터 구조가 팀원 PC마다 다를 수 있으므로 자동 실행하지 않는 것을 권장합니다.

-- SET SQL_SAFE_UPDATES = 0;

-- UPDATE partner_brand b
-- JOIN user_member u ON u.user_id = b.owner_user_id
-- SET b.status = 'REJECTED', b.sales_status = 'INACTIVE'
-- WHERE u.email REGEXP '^seller[0-9]+@.*\\.test$'
--    OR u.login_id REGEXP '^seller[0-9]+$';

-- SET SQL_SAFE_UPDATES = 1;
