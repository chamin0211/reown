-- RE:OWN 10 Brand Dummy Data
-- Scope: frontend/demo data only.
-- Excluded future integrations: Kakao Login, PortOne real payment, Redis KREAM-style bid matching.
-- Recommended: stop Spring Boot before running this file.
USE reown2;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM settlement;
DELETE FROM asset_resell_transaction;
DELETE FROM asset_resell_price_offer;
DELETE FROM asset_resell_market;
DELETE FROM trade_payments;
DELETE FROM trade_order_item;
DELETE FROM trade_orders;
DELETE FROM trade_cart_item;
DELETE FROM trade_funding_participation;
DELETE FROM trade_funding_campaign;
DELETE FROM catalog_product_option;
DELETE FROM catalog_product_category_map;
DELETE FROM catalog_product;
DELETE FROM catalog_category;
DELETE FROM partner_brand;
DELETE FROM user_member;

ALTER TABLE settlement AUTO_INCREMENT = 1;
ALTER TABLE asset_resell_transaction AUTO_INCREMENT = 1;
ALTER TABLE asset_resell_price_offer AUTO_INCREMENT = 1;
ALTER TABLE asset_resell_market AUTO_INCREMENT = 1;
ALTER TABLE trade_payments AUTO_INCREMENT = 1;
ALTER TABLE trade_order_item AUTO_INCREMENT = 1;
ALTER TABLE trade_orders AUTO_INCREMENT = 1;
ALTER TABLE trade_cart_item AUTO_INCREMENT = 1;
ALTER TABLE trade_funding_participation AUTO_INCREMENT = 1;
ALTER TABLE trade_funding_campaign AUTO_INCREMENT = 1;
ALTER TABLE catalog_product_option AUTO_INCREMENT = 1;
ALTER TABLE catalog_product_category_map AUTO_INCREMENT = 1;
ALTER TABLE catalog_product AUTO_INCREMENT = 1;
ALTER TABLE catalog_category AUTO_INCREMENT = 1;
ALTER TABLE partner_brand AUTO_INCREMENT = 1;
ALTER TABLE user_member AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. USERS
-- password is plain text for current simple DB login flow.
-- =====================================================
INSERT INTO user_member (user_id, email, nickname, password, role, created_at) VALUES
                                                                                   (1, 'admin@reown.test', 'REOWN 관리자', '1234', 'ADMIN', '2026-05-01 09:00:00'),
                                                                                   (2, 'user1@test.com', '민지', '1234', 'USER', '2026-05-01 09:10:00'),
                                                                                   (3, 'user2@test.com', '도윤', '1234', 'USER', '2026-05-01 09:20:00'),
                                                                                   (4, 'user3@test.com', '서연', '1234', 'USER', '2026-05-01 09:30:00'),
                                                                                   (5, 'user4@test.com', '현우', '1234', 'USER', '2026-05-01 09:40:00'),
                                                                                   (6, 'user5@test.com', '지우', '1234', 'USER', '2026-05-01 09:50:00'),
                                                                                   (7, 'seller1@nue.test', 'NUE 셀러', '1234', 'SELLER', '2026-05-01 10:00:00'),
                                                                                   (8, 'seller2@lumiere.test', 'LUMIERE 셀러', '1234', 'SELLER', '2026-05-01 10:10:00'),
                                                                                   (9, 'seller3@rawedge.test', 'RAW EDGE 셀러', '1234', 'SELLER', '2026-05-01 10:20:00'),
                                                                                   (10, 'seller4@slowthread.test', 'SLOW THREAD 셀러', '1234', 'SELLER', '2026-05-01 10:30:00'),
                                                                                   (11, 'seller5@hangul.test', 'MODERN HANGUL 셀러', '1234', 'SELLER', '2026-05-01 10:40:00'),
                                                                                   (12, 'seller6@dailyform.test', 'DAILY FORM 셀러', '1234', 'SELLER', '2026-05-01 10:50:00'),
                                                                                   (13, 'seller7@oddatelier.test', 'ODD ATELIER 셀러', '1234', 'SELLER', '2026-05-01 11:00:00'),
                                                                                   (14, 'seller8@monoground.test', 'MONO GROUND 셀러', '1234', 'SELLER', '2026-05-01 11:10:00'),
                                                                                   (15, 'seller9@vertline.test', 'VERT LINE 셀러', '1234', 'SELLER', '2026-05-01 11:20:00'),
                                                                                   (16, 'seller10@seasonless.test', 'SEASONLESS 셀러', '1234', 'SELLER', '2026-05-01 11:30:00');

-- =====================================================
-- 2. BRAND
-- =====================================================
INSERT INTO partner_brand (brand_id, brand_name, brand_logo_url, business_number, owner_user_id, sales_status, settlement_cycle, status, created_at) VALUES
                                                                                                                                                         (1, 'NUE ARCHIVE', 'https://picsum.photos/seed/reown-brand-1/400/400', '101-11-10001', 7, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:00:00'),
                                                                                                                                                         (2, 'LUMIERE STUDIO', 'https://picsum.photos/seed/reown-brand-2/400/400', '102-11-10002', 8, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:10:00'),
                                                                                                                                                         (3, 'RAW EDGE', 'https://picsum.photos/seed/reown-brand-3/400/400', '103-11-10003', 9, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:20:00'),
                                                                                                                                                         (4, 'SLOW THREAD', 'https://picsum.photos/seed/reown-brand-4/400/400', '104-11-10004', 10, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:30:00'),
                                                                                                                                                         (5, 'MODERN HANGUL', 'https://picsum.photos/seed/reown-brand-5/400/400', '105-11-10005', 11, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:40:00'),
                                                                                                                                                         (6, 'DAILY FORM', 'https://picsum.photos/seed/reown-brand-6/400/400', '106-11-10006', 12, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 10:50:00'),
                                                                                                                                                         (7, 'ODD ATELIER', 'https://picsum.photos/seed/reown-brand-7/400/400', '107-11-10007', 13, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 11:00:00'),
                                                                                                                                                         (8, 'MONO GROUND', 'https://picsum.photos/seed/reown-brand-8/400/400', '108-11-10008', 14, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 11:10:00'),
                                                                                                                                                         (9, 'VERT LINE', 'https://picsum.photos/seed/reown-brand-9/400/400', '109-11-10009', 15, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 11:20:00'),
                                                                                                                                                         (10, 'SEASONLESS', 'https://picsum.photos/seed/reown-brand-10/400/400', '110-11-10010', 16, 'ACTIVE', 'MONTHLY', 'APPROVED', '2026-05-01 11:30:00');

-- =====================================================
-- 3. CATEGORY
-- =====================================================
INSERT INTO catalog_category (category_id, name, parent_id) VALUES
                                                                (1, 'OUTER', NULL),
                                                                (2, 'TOP', NULL),
                                                                (3, 'BOTTOM', NULL),
                                                                (4, 'DRESS', NULL),
                                                                (5, 'BAG', NULL),
                                                                (6, 'ACCESSORY', NULL),
                                                                (7, 'FUNDING', NULL),
                                                                (8, 'RESELL', NULL);

-- =====================================================
-- 4. PRODUCTS: 10 brands x 4 products = 40 products
-- sale_type: NORMAL/FUNDING. status: ON_SALE for display.
-- thumbnail_url: React public/images/products 경로 사용
-- =====================================================
INSERT INTO catalog_product (product_id, brand_id, name, thumbnail_url, price, weight_g, max_purchase_per_user, sale_type, status, display_sort_order, created_at) VALUES
                                                                                                                                                                       (1,1,'NUE 오버핏 아카이브 블레이저','/images/products/product-1.jpg',129000,700,2,'NORMAL','ON_SALE',1,'2026-05-02 10:01:00'),
                                                                                                                                                                       (2,1,'NUE 미니멀 코튼 셔츠','/images/products/product-2.jpg',59000,300,3,'NORMAL','ON_SALE',2,'2026-05-02 10:02:00'),
                                                                                                                                                                       (3,1,'NUE 와이드 턱 팬츠','/images/products/product-3.jpg',79000,500,3,'NORMAL','ON_SALE',3,'2026-05-02 10:03:00'),
                                                                                                                                                                       (4,1,'NUE 리버시블 니트 베스트','/images/products/product-4.jpg',69000,350,2,'FUNDING','ON_SALE',4,'2026-05-02 10:04:00'),
                                                                                                                                                                       (5,2,'LUMIERE 실키 드레이프 원피스','/images/products/product-5.jpg',118000,420,2,'NORMAL','ON_SALE',5,'2026-05-02 10:05:00'),
                                                                                                                                                                       (6,2,'LUMIERE 크롭 트위드 자켓','/images/products/product-6.jpg',149000,600,2,'NORMAL','ON_SALE',6,'2026-05-02 10:06:00'),
                                                                                                                                                                       (7,2,'LUMIERE 새틴 블라우스','/images/products/product-7.jpg',76000,280,3,'NORMAL','ON_SALE',7,'2026-05-02 10:07:00'),
                                                                                                                                                                       (8,2,'LUMIERE 플리츠 미디 스커트','/images/products/product-8.jpg',89000,370,3,'FUNDING','ON_SALE',8,'2026-05-02 10:08:00'),
                                                                                                                                                                       (9,3,'RAW EDGE 워시드 데님 자켓','/images/products/product-9.jpg',98000,720,2,'NORMAL','ON_SALE',9,'2026-05-02 10:09:00'),
                                                                                                                                                                       (10,3,'RAW EDGE 그래픽 후드티','/images/products/product-10.jpg',72000,650,3,'NORMAL','ON_SALE',10,'2026-05-02 10:10:00'),
                                                                                                                                                                       (11,3,'RAW EDGE 카고 버뮤다 팬츠','/images/products/product-11.jpg',83000,520,3,'NORMAL','ON_SALE',11,'2026-05-02 10:11:00'),
                                                                                                                                                                       (12,3,'RAW EDGE 빈티지 메신저백','/images/products/product-12.jpg',64000,450,2,'FUNDING','ON_SALE',12,'2026-05-02 10:12:00'),
                                                                                                                                                                       (13,4,'SLOW THREAD 리사이클 코트','/images/products/product-13.jpg',189000,950,1,'NORMAL','ON_SALE',13,'2026-05-02 10:13:00'),
                                                                                                                                                                       (14,4,'SLOW THREAD 오가닉 스웨트셔츠','/images/products/product-14.jpg',68000,520,3,'NORMAL','ON_SALE',14,'2026-05-02 10:14:00'),
                                                                                                                                                                       (15,4,'SLOW THREAD 린넨 밴딩 팬츠','/images/products/product-15.jpg',74000,430,3,'NORMAL','ON_SALE',15,'2026-05-02 10:15:00'),
                                                                                                                                                                       (16,4,'SLOW THREAD 업사이클 토트백','/images/products/product-16.jpg',52000,310,2,'FUNDING','ON_SALE',16,'2026-05-02 10:16:00'),
                                                                                                                                                                       (17,5,'MODERN HANGUL 자음 그래픽 티셔츠','/images/products/product-17.jpg',43000,240,4,'NORMAL','ON_SALE',17,'2026-05-02 10:17:00'),
                                                                                                                                                                       (18,5,'MODERN HANGUL 한글 패턴 셔츠','/images/products/product-18.jpg',69000,320,3,'NORMAL','ON_SALE',18,'2026-05-02 10:18:00'),
                                                                                                                                                                       (19,5,'MODERN HANGUL 자수 볼캡','/images/products/product-19.jpg',39000,150,4,'NORMAL','ON_SALE',19,'2026-05-02 10:19:00'),
                                                                                                                                                                       (20,5,'MODERN HANGUL 타이포 니트','/images/products/product-20.jpg',97000,480,2,'FUNDING','ON_SALE',20,'2026-05-02 10:20:00'),
                                                                                                                                                                       (21,6,'DAILY FORM 데일리 후드 집업','/images/products/product-21.jpg',62000,610,4,'NORMAL','ON_SALE',21,'2026-05-02 10:21:00'),
                                                                                                                                                                       (22,6,'DAILY FORM 베이직 롱슬리브','/images/products/product-22.jpg',36000,250,5,'NORMAL','ON_SALE',22,'2026-05-02 10:22:00'),
                                                                                                                                                                       (23,6,'DAILY FORM 스트레이트 데님','/images/products/product-23.jpg',69000,560,3,'NORMAL','ON_SALE',23,'2026-05-02 10:23:00'),
                                                                                                                                                                       (24,6,'DAILY FORM 나일론 크로스백','/images/products/product-24.jpg',48000,280,3,'FUNDING','ON_SALE',24,'2026-05-02 10:24:00'),
                                                                                                                                                                       (25,7,'ODD ATELIER 언밸런스 자켓','/images/products/product-25.jpg',158000,670,2,'NORMAL','ON_SALE',25,'2026-05-02 10:25:00'),
                                                                                                                                                                       (26,7,'ODD ATELIER 레이어드 탑','/images/products/product-26.jpg',82000,310,3,'NORMAL','ON_SALE',26,'2026-05-02 10:26:00'),
                                                                                                                                                                       (27,7,'ODD ATELIER 컷아웃 슬랙스','/images/products/product-27.jpg',108000,510,2,'NORMAL','ON_SALE',27,'2026-05-02 10:27:00'),
                                                                                                                                                                       (28,7,'ODD ATELIER 구조적 미니백','/images/products/product-28.jpg',86000,360,2,'FUNDING','ON_SALE',28,'2026-05-02 10:28:00'),
                                                                                                                                                                       (29,8,'MONO GROUND 블랙 싱글 코트','/images/products/product-29.jpg',169000,900,2,'NORMAL','ON_SALE',29,'2026-05-02 10:29:00'),
                                                                                                                                                                       (30,8,'MONO GROUND 화이트 셔츠','/images/products/product-30.jpg',54000,290,4,'NORMAL','ON_SALE',30,'2026-05-02 10:30:00'),
                                                                                                                                                                       (31,8,'MONO GROUND 테이퍼드 팬츠','/images/products/product-31.jpg',73000,480,3,'NORMAL','ON_SALE',31,'2026-05-02 10:31:00'),
                                                                                                                                                                       (32,8,'MONO GROUND 미니멀 백팩','/images/products/product-32.jpg',99000,520,2,'FUNDING','ON_SALE',32,'2026-05-02 10:32:00'),
                                                                                                                                                                       (33,9,'VERT LINE 라이트 윈드브레이커','/images/products/product-33.jpg',99000,430,3,'NORMAL','ON_SALE',33,'2026-05-02 10:33:00'),
                                                                                                                                                                       (34,9,'VERT LINE 테크 유틸리티 베스트','/images/products/product-34.jpg',88000,360,2,'NORMAL','ON_SALE',34,'2026-05-02 10:34:00'),
                                                                                                                                                                       (35,9,'VERT LINE 조거 팬츠','/images/products/product-35.jpg',79000,470,3,'NORMAL','ON_SALE',35,'2026-05-02 10:35:00'),
                                                                                                                                                                       (36,9,'VERT LINE 리사이클 버킷햇','/images/products/product-36.jpg',42000,140,4,'FUNDING','ON_SALE',36,'2026-05-02 10:36:00'),
                                                                                                                                                                       (37,10,'SEASONLESS 울 블렌드 자켓','/images/products/product-37.jpg',148000,680,2,'NORMAL','ON_SALE',37,'2026-05-02 10:37:00'),
                                                                                                                                                                       (38,10,'SEASONLESS 프리미엄 터틀넥','/images/products/product-38.jpg',67000,340,3,'NORMAL','ON_SALE',38,'2026-05-02 10:38:00'),
                                                                                                                                                                       (39,10,'SEASONLESS 세미와이드 슬랙스','/images/products/product-39.jpg',82000,500,3,'NORMAL','ON_SALE',39,'2026-05-02 10:39:00'),
                                                                                                                                                                       (40,10,'SEASONLESS 레더 미니백','/images/products/product-40.jpg',119000,410,2,'FUNDING','ON_SALE',40,'2026-05-02 10:40:00');

-- Product category mapping: simple display mapping
INSERT INTO catalog_product_category_map (map_id, product_id, category_id) VALUES
                                                                               (1,1,1),(2,2,2),(3,3,3),(4,4,2),(5,5,4),(6,6,1),(7,7,2),(8,8,3),
                                                                               (9,9,1),(10,10,2),(11,11,3),(12,12,5),(13,13,1),(14,14,2),(15,15,3),(16,16,5),
                                                                               (17,17,2),(18,18,2),(19,19,6),(20,20,2),(21,21,1),(22,22,2),(23,23,3),(24,24,5),
                                                                               (25,25,1),(26,26,2),(27,27,3),(28,28,5),(29,29,1),(30,30,2),(31,31,3),(32,32,5),
                                                                               (33,33,1),(34,34,1),(35,35,3),(36,36,6),(37,37,1),(38,38,2),(39,39,3),(40,40,5),
                                                                               (41,4,7),(42,8,7),(43,12,7),(44,16,7),(45,20,7),(46,24,7),(47,28,7),(48,32,7),(49,36,7),(50,40,7);

-- =====================================================
-- 5. PRODUCT OPTIONS: 2 options per product = 80
-- option_id rule: product_id*2-1 = M, product_id*2 = L
-- =====================================================
INSERT INTO catalog_product_option (option_id, product_id, size, color, color_hex, stock_quantity, safety_stock, reserved_quantity) VALUES
                                                                                                                                        (1,1,'M','BLACK','#000000',19,3,0),
                                                                                                                                        (2,1,'L','WHITE','#FFFFFF',15,3,0),
                                                                                                                                        (3,2,'M','WHITE','#FFFFFF',20,3,0),
                                                                                                                                        (4,2,'L','NAVY','#1F2A44',16,3,0),
                                                                                                                                        (5,3,'M','NAVY','#1F2A44',21,3,0),
                                                                                                                                        (6,3,'L','KHAKI','#6B6A3D',17,3,0),
                                                                                                                                        (7,4,'M','KHAKI','#6B6A3D',22,3,0),
                                                                                                                                        (8,4,'L','GRAY','#808080',18,3,0),
                                                                                                                                        (9,5,'M','GRAY','#808080',23,3,0),
                                                                                                                                        (10,5,'L','BEIGE','#D8C3A5',19,3,0),
                                                                                                                                        (11,6,'M','BEIGE','#D8C3A5',24,3,0),
                                                                                                                                        (12,6,'L','BLACK','#000000',20,3,0),
                                                                                                                                        (13,7,'M','BLACK','#000000',25,3,0),
                                                                                                                                        (14,7,'L','WHITE','#FFFFFF',14,3,0),
                                                                                                                                        (15,8,'M','WHITE','#FFFFFF',18,3,0),
                                                                                                                                        (16,8,'L','NAVY','#1F2A44',15,3,0),
                                                                                                                                        (17,9,'M','NAVY','#1F2A44',19,3,0),
                                                                                                                                        (18,9,'L','KHAKI','#6B6A3D',16,3,0),
                                                                                                                                        (19,10,'M','KHAKI','#6B6A3D',20,3,0),
                                                                                                                                        (20,10,'L','GRAY','#808080',17,3,0),
                                                                                                                                        (21,11,'M','GRAY','#808080',21,3,0),
                                                                                                                                        (22,11,'L','BEIGE','#D8C3A5',18,3,0),
                                                                                                                                        (23,12,'M','BEIGE','#D8C3A5',22,3,0),
                                                                                                                                        (24,12,'L','BLACK','#000000',19,3,0),
                                                                                                                                        (25,13,'M','BLACK','#000000',23,3,0),
                                                                                                                                        (26,13,'L','WHITE','#FFFFFF',20,3,0),
                                                                                                                                        (27,14,'M','WHITE','#FFFFFF',24,3,0),
                                                                                                                                        (28,14,'L','NAVY','#1F2A44',14,3,0),
                                                                                                                                        (29,15,'M','NAVY','#1F2A44',25,3,0),
                                                                                                                                        (30,15,'L','KHAKI','#6B6A3D',15,3,0),
                                                                                                                                        (31,16,'M','KHAKI','#6B6A3D',18,3,0),
                                                                                                                                        (32,16,'L','GRAY','#808080',16,3,0),
                                                                                                                                        (33,17,'M','GRAY','#808080',19,3,0),
                                                                                                                                        (34,17,'L','BEIGE','#D8C3A5',17,3,0),
                                                                                                                                        (35,18,'M','BEIGE','#D8C3A5',20,3,0),
                                                                                                                                        (36,18,'L','BLACK','#000000',18,3,0),
                                                                                                                                        (37,19,'M','BLACK','#000000',21,3,0),
                                                                                                                                        (38,19,'L','WHITE','#FFFFFF',19,3,0),
                                                                                                                                        (39,20,'M','WHITE','#FFFFFF',22,3,0),
                                                                                                                                        (40,20,'L','NAVY','#1F2A44',20,3,0),
                                                                                                                                        (41,21,'M','NAVY','#1F2A44',23,3,0),
                                                                                                                                        (42,21,'L','KHAKI','#6B6A3D',14,3,0),
                                                                                                                                        (43,22,'M','KHAKI','#6B6A3D',24,3,0),
                                                                                                                                        (44,22,'L','GRAY','#808080',15,3,0),
                                                                                                                                        (45,23,'M','GRAY','#808080',25,3,0),
                                                                                                                                        (46,23,'L','BEIGE','#D8C3A5',16,3,0),
                                                                                                                                        (47,24,'M','BEIGE','#D8C3A5',18,3,0),
                                                                                                                                        (48,24,'L','BLACK','#000000',17,3,0),
                                                                                                                                        (49,25,'M','BLACK','#000000',19,3,0),
                                                                                                                                        (50,25,'L','WHITE','#FFFFFF',18,3,0),
                                                                                                                                        (51,26,'M','WHITE','#FFFFFF',20,3,0),
                                                                                                                                        (52,26,'L','NAVY','#1F2A44',19,3,0),
                                                                                                                                        (53,27,'M','NAVY','#1F2A44',21,3,0),
                                                                                                                                        (54,27,'L','KHAKI','#6B6A3D',20,3,0),
                                                                                                                                        (55,28,'M','KHAKI','#6B6A3D',22,3,0),
                                                                                                                                        (56,28,'L','GRAY','#808080',14,3,0),
                                                                                                                                        (57,29,'M','GRAY','#808080',23,3,0),
                                                                                                                                        (58,29,'L','BEIGE','#D8C3A5',15,3,0),
                                                                                                                                        (59,30,'M','BEIGE','#D8C3A5',24,3,0),
                                                                                                                                        (60,30,'L','BLACK','#000000',16,3,0),
                                                                                                                                        (61,31,'M','BLACK','#000000',25,3,0),
                                                                                                                                        (62,31,'L','WHITE','#FFFFFF',17,3,0),
                                                                                                                                        (63,32,'M','WHITE','#FFFFFF',18,3,0),
                                                                                                                                        (64,32,'L','NAVY','#1F2A44',18,3,0),
                                                                                                                                        (65,33,'M','NAVY','#1F2A44',19,3,0),
                                                                                                                                        (66,33,'L','KHAKI','#6B6A3D',19,3,0),
                                                                                                                                        (67,34,'M','KHAKI','#6B6A3D',20,3,0),
                                                                                                                                        (68,34,'L','GRAY','#808080',20,3,0),
                                                                                                                                        (69,35,'M','GRAY','#808080',21,3,0),
                                                                                                                                        (70,35,'L','BEIGE','#D8C3A5',14,3,0),
                                                                                                                                        (71,36,'M','BEIGE','#D8C3A5',22,3,0),
                                                                                                                                        (72,36,'L','BLACK','#000000',15,3,0),
                                                                                                                                        (73,37,'M','BLACK','#000000',23,3,0),
                                                                                                                                        (74,37,'L','WHITE','#FFFFFF',16,3,0),
                                                                                                                                        (75,38,'M','WHITE','#FFFFFF',24,3,0),
                                                                                                                                        (76,38,'L','NAVY','#1F2A44',17,3,0),
                                                                                                                                        (77,39,'M','NAVY','#1F2A44',25,3,0),
                                                                                                                                        (78,39,'L','KHAKI','#6B6A3D',18,3,0),
                                                                                                                                        (79,40,'M','KHAKI','#6B6A3D',18,3,0),
                                                                                                                                        (80,40,'L','GRAY','#808080',19,3,0);

-- =====================================================
-- 6. FUNDING CAMPAIGNS + PARTICIPATION HISTORY
-- =====================================================
INSERT INTO trade_funding_campaign (campaign_id, product_id, target_amount, current_amount, start_date, end_date, funding_status) VALUES
                                                                                                                                      (1,4,1200000,720000,'2026-05-03 00:00:00','2026-06-03 23:59:59','OPEN'),
                                                                                                                                      (2,8,1800000,540000,'2026-05-03 00:00:00','2026-06-10 23:59:59','OPEN'),
                                                                                                                                      (3,12,900000,900000,'2026-04-20 00:00:00','2026-05-31 23:59:59','SUCCESS'),
                                                                                                                                      (4,16,700000,210000,'2026-05-03 00:00:00','2026-06-15 23:59:59','OPEN'),
                                                                                                                                      (5,20,1500000,600000,'2026-05-03 00:00:00','2026-06-20 23:59:59','OPEN'),
                                                                                                                                      (6,24,800000,160000,'2026-05-03 00:00:00','2026-06-25 23:59:59','OPEN'),
                                                                                                                                      (7,28,1300000,390000,'2026-05-03 00:00:00','2026-07-01 23:59:59','OPEN'),
                                                                                                                                      (8,32,2000000,0,'2026-05-03 00:00:00','2026-07-05 23:59:59','OPEN');

INSERT INTO trade_funding_participation (participation_id, campaign_id, user_id, amount, status, created_at) VALUES
                                                                                                                 (1,1,2,120000,'PARTICIPATED','2026-05-04 11:00:00'),
                                                                                                                 (2,1,3,200000,'PARTICIPATED','2026-05-04 13:10:00'),
                                                                                                                 (3,1,4,400000,'PARTICIPATED','2026-05-05 09:30:00'),
                                                                                                                 (4,2,2,240000,'PARTICIPATED','2026-05-05 10:00:00'),
                                                                                                                 (5,2,5,300000,'PARTICIPATED','2026-05-05 15:20:00'),
                                                                                                                 (6,3,2,450000,'PARTICIPATED','2026-04-22 10:00:00'),
                                                                                                                 (7,3,6,450000,'PARTICIPATED','2026-04-25 10:00:00'),
                                                                                                                 (8,4,3,210000,'PARTICIPATED','2026-05-06 19:00:00'),
                                                                                                                 (9,5,4,300000,'PARTICIPATED','2026-05-07 12:00:00'),
                                                                                                                 (10,5,5,300000,'PARTICIPATED','2026-05-07 14:00:00'),
                                                                                                                 (11,6,6,160000,'PARTICIPATED','2026-05-08 18:00:00'),
                                                                                                                 (12,7,2,390000,'PARTICIPATED','2026-05-09 20:00:00');

-- =====================================================
-- 7. ORDERS / ITEMS / PAYMENTS / SHIPPING
-- order item IDs are used for resale seed data.
-- =====================================================
INSERT INTO trade_orders (order_id, user_id, order_no, total_payment_amount, shipping_address_snapshot, status, shipping_status, tracking_number, shipped_at, delivered_at, created_at) VALUES
                                                                                                                                                                                            (1,2,'ORD-20260501-0001',129000,'서울시 마포구 연남동 11-1','PAID','DELIVERED','CJ-0001','2026-05-02 10:00:00','2026-05-03 16:00:00','2026-05-01 12:00:00'),
                                                                                                                                                                                            (2,3,'ORD-20260501-0002',76000,'서울시 성동구 성수동 22-2','PAID','DELIVERED','CJ-0002','2026-05-02 11:00:00','2026-05-03 17:00:00','2026-05-01 12:30:00'),
                                                                                                                                                                                            (3,4,'ORD-20260501-0003',72000,'경기도 수원시 영통구 33-3','PAID','DELIVERED','CJ-0003','2026-05-02 12:00:00','2026-05-03 18:00:00','2026-05-01 13:00:00'),
                                                                                                                                                                                            (4,5,'ORD-20260501-0004',68000,'인천시 부평구 44-4','PAID','DELIVERED','CJ-0004','2026-05-02 13:00:00','2026-05-03 19:00:00','2026-05-01 13:30:00'),
                                                                                                                                                                                            (5,6,'ORD-20260501-0005',43000,'부산시 해운대구 55-5','PAID','SHIPPED','CJ-0005','2026-05-03 10:00:00',NULL,'2026-05-01 14:00:00'),
                                                                                                                                                                                            (6,2,'ORD-20260501-0006',62000,'서울시 마포구 연남동 11-1','PAID','SHIPPED','CJ-0006','2026-05-03 11:00:00',NULL,'2026-05-01 14:30:00'),
                                                                                                                                                                                            (7,3,'ORD-20260501-0007',158000,'서울시 성동구 성수동 22-2','PAID','READY',NULL,NULL,NULL,'2026-05-01 15:00:00'),
                                                                                                                                                                                            (8,4,'ORD-20260501-0008',54000,'경기도 수원시 영통구 33-3','PAID','READY',NULL,NULL,NULL,'2026-05-01 15:30:00'),
                                                                                                                                                                                            (9,5,'ORD-20260501-0009',99000,'인천시 부평구 44-4','PAID','READY',NULL,NULL,NULL,'2026-05-01 16:00:00'),
                                                                                                                                                                                            (10,6,'ORD-20260501-0010',148000,'부산시 해운대구 55-5','PAID','PREPARING',NULL,NULL,NULL,'2026-05-01 16:30:00');

INSERT INTO trade_order_item (order_item_id, order_id, option_id, quantity, unit_price, item_status) VALUES
                                                                                                         (1,1,1,1,129000,'ORDERED'),
                                                                                                         (2,2,13,1,76000,'ORDERED'),
                                                                                                         (3,3,20,1,72000,'ORDERED'),
                                                                                                         (4,4,28,1,68000,'ORDERED'),
                                                                                                         (5,5,33,1,43000,'ORDERED'),
                                                                                                         (6,6,41,1,62000,'ORDERED'),
                                                                                                         (7,7,49,1,158000,'ORDERED'),
                                                                                                         (8,8,60,1,54000,'ORDERED'),
                                                                                                         (9,9,65,1,99000,'ORDERED'),
                                                                                                         (10,10,73,1,148000,'ORDERED');

INSERT INTO trade_payments (payment_id, order_id, pg_tid, payment_method, amount, status, paid_at) VALUES
                                                                                                       (1,1,'MOCK-20260501-0001','MOCK_CARD',129000,'PAID','2026-05-01 12:01:00'),
                                                                                                       (2,2,'MOCK-20260501-0002','MOCK_CARD',76000,'PAID','2026-05-01 12:31:00'),
                                                                                                       (3,3,'MOCK-20260501-0003','MOCK_CARD',72000,'PAID','2026-05-01 13:01:00'),
                                                                                                       (4,4,'MOCK-20260501-0004','MOCK_CARD',68000,'PAID','2026-05-01 13:31:00'),
                                                                                                       (5,5,'MOCK-20260501-0005','MOCK_CARD',43000,'PAID','2026-05-01 14:01:00'),
                                                                                                       (6,6,'MOCK-20260501-0006','MOCK_CARD',62000,'PAID','2026-05-01 14:31:00'),
                                                                                                       (7,7,'MOCK-20260501-0007','MOCK_CARD',158000,'PAID','2026-05-01 15:01:00'),
                                                                                                       (8,8,'MOCK-20260501-0008','MOCK_CARD',54000,'PAID','2026-05-01 15:31:00'),
                                                                                                       (9,9,'MOCK-20260501-0009','MOCK_CARD',99000,'PAID','2026-05-01 16:01:00'),
                                                                                                       (10,10,'MOCK-20260501-0010','MOCK_CARD',148000,'PAID','2026-05-01 16:31:00');

-- =====================================================
-- 8. RESELL MARKET / OFFERS / TRANSACTIONS
-- 10 resale products: some ON_SALE, some SOLD.
-- =====================================================
INSERT INTO asset_resell_market (resell_id, order_item_id, seller_id, product_id, option_id, resell_price, condition_description, status, created_at) VALUES
                                                                                                                                                          (1,1,2,1,1,99000,'1회 착용, 오염 없음, 구성품 보관','ON_SALE','2026-05-04 10:00:00'),
                                                                                                                                                          (2,2,3,7,13,59000,'시착 후 보관, 새상품에 가까움','ON_SALE','2026-05-04 10:10:00'),
                                                                                                                                                          (3,3,4,10,20,52000,'2회 착용, 후드 끈 상태 양호','ON_SALE','2026-05-04 10:20:00'),
                                                                                                                                                          (4,4,5,14,28,49000,'생활감 약간 있음, 세탁 완료','ON_SALE','2026-05-04 10:30:00'),
                                                                                                                                                          (5,5,6,17,33,32000,'1회 착용, 프린팅 상태 좋음','ON_SALE','2026-05-04 10:40:00'),
                                                                                                                                                          (6,6,2,21,41,45000,'3회 착용, 지퍼 정상','SOLD','2026-05-04 10:50:00'),
                                                                                                                                                          (7,7,3,25,49,129000,'촬영용 1회 착용, 상태 매우 좋음','SOLD','2026-05-04 11:00:00'),
                                                                                                                                                          (8,8,4,30,60,39000,'드라이 완료, 목 늘어남 없음','SOLD','2026-05-04 11:10:00'),
                                                                                                                                                          (9,9,5,33,65,76000,'야외 1회 착용, 하자 없음','SOLD','2026-05-04 11:20:00'),
                                                                                                                                                          (10,10,6,37,73,119000,'선물 수령 후 보관, 택 보유','ON_SALE','2026-05-04 11:30:00');

INSERT INTO asset_resell_price_offer (offer_id, resell_id, buyer_id, offer_price, status, created_at) VALUES
                                                                                                          (1,1,3,94000,'PENDING','2026-05-04 13:00:00'),
                                                                                                          (2,1,4,96000,'PENDING','2026-05-04 13:10:00'),
                                                                                                          (3,2,2,54000,'PENDING','2026-05-04 13:20:00'),
                                                                                                          (4,3,5,50000,'PENDING','2026-05-04 13:30:00'),
                                                                                                          (5,4,6,46000,'PENDING','2026-05-04 13:40:00'),
                                                                                                          (6,6,4,43000,'ACCEPTED','2026-05-04 14:00:00'),
                                                                                                          (7,7,5,125000,'ACCEPTED','2026-05-04 14:10:00'),
                                                                                                          (8,8,2,37000,'ACCEPTED','2026-05-04 14:20:00'),
                                                                                                          (9,9,3,73000,'ACCEPTED','2026-05-04 14:30:00');

INSERT INTO asset_resell_transaction (transaction_id, resell_id, buyer_id, resell_price, platform_fee, status, created_at) VALUES
                                                                                                                               (1,6,4,45000,2250,'COMPLETED','2026-05-04 15:00:00'),
                                                                                                                               (2,7,5,129000,6450,'COMPLETED','2026-05-04 15:10:00'),
                                                                                                                               (3,8,2,39000,1950,'COMPLETED','2026-05-04 15:20:00'),
                                                                                                                               (4,9,3,76000,3800,'COMPLETED','2026-05-04 15:30:00');

-- =====================================================
-- 9. SETTLEMENT
-- Includes normal order sales and completed resale transactions in demo scope.
-- =====================================================
INSERT INTO settlement (settlement_id, brand_id, settlement_type, total_sales_amount, platform_fee, settlement_amount, status, period_start, period_end, created_at, settled_at) VALUES
                                                                                                                                                                                     (1,1,'ALL',228000,11400,216600,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:00:00',NULL),
                                                                                                                                                                                     (2,2,'ALL',135000,6750,128250,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:10:00',NULL),
                                                                                                                                                                                     (3,3,'ALL',124000,6200,117800,'COMPLETED','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:20:00','2026-05-06 11:00:00'),
                                                                                                                                                                                     (4,4,'ALL',117000,5850,111150,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:30:00',NULL),
                                                                                                                                                                                     (5,5,'ALL',75000,3750,71250,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:40:00',NULL),
                                                                                                                                                                                     (6,6,'ALL',107000,5350,101650,'COMPLETED','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 09:50:00','2026-05-06 12:00:00'),
                                                                                                                                                                                     (7,7,'ALL',287000,14350,272650,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 10:00:00',NULL),
                                                                                                                                                                                     (8,8,'ALL',93000,4650,88350,'COMPLETED','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 10:10:00','2026-05-06 13:00:00'),
                                                                                                                                                                                     (9,9,'ALL',175000,8750,166250,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 10:20:00',NULL),
                                                                                                                                                                                     (10,10,'ALL',148000,7400,140600,'READY','2026-05-01 00:00:00','2026-05-31 23:59:59','2026-05-05 10:30:00',NULL);

-- =====================================================
-- 10. OPTIONAL CART SAMPLE
-- =====================================================
INSERT INTO trade_cart_item (cart_id, user_id, option_id, quantity) VALUES
                                                                        (1,2,4,1),
                                                                        (2,3,18,1),
                                                                        (3,4,54,1);

-- Done.