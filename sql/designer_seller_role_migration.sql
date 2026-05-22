USE reown_db;

-- 디자이너 셀러 권한을 user_member.role에 저장하기 위한 개발 DB 마이그레이션입니다.
-- 이미 DESIGNER 값이 허용되어 있으면 다시 실행하지 않아도 됩니다.
ALTER TABLE user_member
MODIFY COLUMN role ENUM('USER', 'SELLER', 'DESIGNER', 'ADMIN') NOT NULL;
