USE reown_db;

-- 관리자 승인 대기/MASTER 권한을 추가합니다.
ALTER TABLE user_member
MODIFY COLUMN role ENUM(
    'USER',
    'SELLER_PENDING',
    'SELLER',
    'DESIGNER',
    'ADMIN_PENDING',
    'ADMIN',
    'MASTER'
) NOT NULL;

-- 기존 데모 관리자 계정을 MASTER로 지정합니다.
-- 현재 사용하는 관리자 이메일이 다르면 admin@test.com 부분만 수정해서 실행하세요.
UPDATE user_member
SET role = 'MASTER'
WHERE email = 'admin@test.com';

-- 확인용
SELECT user_id, email, nickname, role
FROM user_member
WHERE role IN ('ADMIN_PENDING', 'ADMIN', 'MASTER')
ORDER BY user_id DESC;
