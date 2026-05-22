USE reown_db;

-- 로그인 아이디 기반 로그인 + 로그인 보안 컬럼 추가용 SQL입니다.
-- 이미 실행한 구문은 중복 실행 시 오류가 날 수 있으니, 오류가 나면 다음 구문으로 넘어가면 됩니다.

-- 1. login_id 컬럼이 아직 없다면 추가합니다.
ALTER TABLE user_member
ADD COLUMN login_id VARCHAR(50) NULL AFTER user_id;

-- 2. 기존 이메일 계정의 login_id를 이메일 앞부분으로 채웁니다.
SET SQL_SAFE_UPDATES = 0;

UPDATE user_member
SET login_id = LOWER(SUBSTRING_INDEX(email, '@', 1))
WHERE login_id IS NULL;

-- 3. 대표 테스트 계정 아이디를 알기 쉽게 정리합니다.
-- 이메일이 없는 계정이면 0 rows affected가 나와도 괜찮습니다.
UPDATE user_member SET login_id = 'admin' WHERE email = 'admin@test.com';
UPDATE user_member SET login_id = 'seller' WHERE email = 'seller@test.com';
UPDATE user_member SET login_id = 'user' WHERE email = 'user@test.com';

SET SQL_SAFE_UPDATES = 1;

-- 4. 중복 login_id가 있는지 먼저 확인합니다.
SELECT login_id, COUNT(*) AS count
FROM user_member
GROUP BY login_id
HAVING COUNT(*) > 1;

-- 위 SELECT 결과가 비어있을 때만 아래 2개를 실행하세요.
-- ALTER TABLE user_member MODIFY COLUMN login_id VARCHAR(50) NOT NULL;
-- ALTER TABLE user_member ADD CONSTRAINT uk_user_member_login_id UNIQUE (login_id);

-- 5. 로그인 실패 잠금/마지막 로그인 기록 컬럼을 추가합니다.
ALTER TABLE user_member
ADD COLUMN failed_login_count INT NOT NULL DEFAULT 0,
ADD COLUMN locked_until DATETIME NULL,
ADD COLUMN last_login_at DATETIME NULL;

-- 6. BCrypt 해시 저장을 위해 비밀번호 컬럼 길이를 늘립니다.
ALTER TABLE user_member
MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- 7. 권한 enum을 최신 흐름에 맞춥니다.
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
