USE reown_db;

-- 회원가입 단계에서 USER / SELLER_PENDING / SELLER / DESIGNER / ADMIN 역할을 구분하기 위한 마이그레이션입니다.
-- 기존에 DESIGNER까지 추가했다면 SELLER_PENDING만 더 추가되는 효과입니다.
ALTER TABLE user_member
MODIFY COLUMN role ENUM('USER', 'SELLER_PENDING', 'SELLER', 'DESIGNER', 'ADMIN') NOT NULL;
