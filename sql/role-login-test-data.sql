USE reown_db;

SELECT user_id, email, password, nickname, role, created_at
FROM user_member
WHERE email = 'seller@test.com';